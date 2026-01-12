'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error('Partner details error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">Failed to load partner details</h2>
                <p className="text-white/70">{error.message || 'Something went wrong'}</p>
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => router.push('/network')}
                        variant="outline"
                    >
                        Back to Network
                    </Button>
                    <Button
                        onClick={reset}
                        className="bg-white text-black hover:bg-white/90"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
    );
}
