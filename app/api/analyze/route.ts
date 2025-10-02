import { google } from '@ai-sdk/google';
import { prompt } from './prompt';
import { generateText } from 'ai';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    // Convert the file's arrayBuffer to a Base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Convert Uint8Array to an array of characters
    const charArray = Array.from(uint8Array, byte => String.fromCharCode(byte));
    const binaryString = charArray.join('');
    const base64Data = btoa(binaryString);
    const fileDataUrl = `data:application/pdf;base64,${base64Data}`;


    const result = await generateText({
        model: google('gemini-2.5-flash-lite'),
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: prompt,
                    },
                    {
                        type: 'file',
                        data: fileDataUrl,
                        mediaType: 'application/pdf',
                    },
                ],
            },
        ],
    });

    return new Response(result.text);
}