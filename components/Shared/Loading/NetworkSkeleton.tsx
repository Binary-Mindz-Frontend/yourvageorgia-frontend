"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const NetworkSkeleton = () => {
    return (
        <div className="space-y-10 w-full animate-in fade-in duration-300">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg"
                >
                    <Skeleton className="absolute inset-0 w-full h-full bg-white/5" />
                    <div className="absolute bottom-0 left-0 p-6 w-full space-y-3">
                        <Skeleton className="h-8 w-1/3 bg-white/10" />
                        <Skeleton className="h-4 w-1/4 bg-white/5" />
                    </div>
                </div>
            ))}
        </div>
    );
};
