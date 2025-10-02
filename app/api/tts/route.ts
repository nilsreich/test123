import { NextResponse, type NextRequest } from 'next/server';
import {   GoogleGenAI } from '@google/genai';

// --- Hilfsfunktionen zum Erstellen eines WAV-Headers ---

interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

/**
 * Parst den Mime-Type, um Audio-Parameter zu extrahieren.
 * z.B. "audio/L16;rate=24000" -> { bitsPerSample: 16, sampleRate: 24000 }
 */
function parseMimeType(mimeType: string): WavConversionOptions {
  const parts = mimeType.split(';');
  const formatPart = parts[0];
  const params: Record<string, string> = {};
  for (const param of parts.slice(1)) {
    const [key, value] = param.trim().split('=');
    params[key] = value;
  }

  const options: Partial<WavConversionOptions> = {
    numChannels: 1, // Gemini TTS ist Mono
  };

  if (formatPart === 'audio/L16') {
    options.bitsPerSample = 16;
  }

  if (params.rate) {
    options.sampleRate = parseInt(params.rate, 10);
  }

  if (!options.bitsPerSample || !options.sampleRate) {
    throw new Error(`Konnte Mime-Type nicht parsen: ${mimeType}`);
  }

  return options as WavConversionOptions;
}

/**
 * Erstellt einen 44-Byte WAV-Header.
 * http://soundfile.sapp.org/doc/WaveFormat/
 */
function createWavHeader(dataLength: number, options: WavConversionOptions): Buffer {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}


// --- API Handler ---

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
    }
    
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });
  const config = {
    temperature: 1,
    responseModalities: [
        'audio',
    ],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: 'Zephyr',
        }
      }
    },
  };
    const model = 'gemini-2.5-flash-preview-tts';
    
const contents = [
    {
      role: 'user',
      parts: [
        {
          text: text,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

    // Audiodaten aus dem Stream sammeln
    let audioDataParts: string[] = [];
    let mimeType = '';

    for await (const chunk of response) {
      const part = chunk.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        if (!mimeType && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
        }
        if (part.inlineData.data) {
          audioDataParts.push(part.inlineData.data);
        }
      }
    }

    if (audioDataParts.length === 0 || !mimeType) {
       return NextResponse.json({ error: 'Failed to generate audio from API' }, { status: 500 });
    }
    
    // Base64-Teile zusammenfügen und in einen Buffer umwandeln
    const rawAudioBase64 = audioDataParts.join('');
    const rawAudioBuffer = Buffer.from(rawAudioBase64, 'base64');
    
    // WAV-Header erstellen und mit den Audiodaten kombinieren
    const wavOptions = parseMimeType(mimeType);
    const wavHeader = createWavHeader(rawAudioBuffer.length, wavOptions);
    const finalWavBuffer = Buffer.concat([wavHeader, rawAudioBuffer]);
    
    return new NextResponse(finalWavBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': String(finalWavBuffer.length),
      },
    });

  } catch (error) {
    console.error('Error generating speech:', error);
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
