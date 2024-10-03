'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main>
            <h1>Error Page</h1>
            <p>{error.message}</p>
            <button onClick={reset}>Reset</button>
        </main>
    );
}
