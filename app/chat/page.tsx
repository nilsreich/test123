'use client';

import { useState } from 'react';

export default function Page() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse('');

    // Create FormData from the form event
    const formData = new FormData(event.currentTarget);

    // POST the form data to the API
    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    // Set the response text
    if (res.ok) {
      setResponse(await res.text());
    } else {
      setResponse('An error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="pdf" type="file" accept="application/pdf" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>

      {response && (
        <pre>
          {response}
        </pre>
      )}
    </div>
  );
}