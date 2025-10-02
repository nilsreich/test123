'use client';

import { useState, type FormEvent } from 'react';

export default function TextToSpeechPage() {
  const [text, setText] = useState<string>('Hallo Welt! Ich bin Gemini und kann Text in Sprache umwandeln.');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Gemini Text-to-Speech</h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
          Gib einen Text ein, um ihn mit der Gemini API in eine Audiodatei umzuwandeln.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Schreibe hier deinen Text..."
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Audio wird generiert...' : 'Audio generieren'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
            <p><span className="font-bold">Fehler:</span> {error}</p>
          </div>
        )}

        {audioUrl && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Ergebnis</h2>
            <audio controls src={audioUrl} className="w-full">
              Dein Browser unterstützt das Audio-Element nicht.
            </audio>
            <div className="text-center mt-4">
              <a 
                href={audioUrl} 
                download="output.wav" 
                className="text-blue-500 hover:underline"
              >
                Audiodatei herunterladen
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
