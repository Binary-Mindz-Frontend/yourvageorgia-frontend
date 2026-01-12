'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Network page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
                <p className="text-white/70">Failed to load network partners</p>
                <Button
                    onClick={reset}
                    className="bg-white text-black hover:bg-white/90"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
}
