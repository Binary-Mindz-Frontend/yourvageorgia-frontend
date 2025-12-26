"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeautifulLoaderProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    text?: string;
    fullScreen?: boolean;
}

export const BeautifulLoader = ({
    className,
    size = "md",
    text,
    fullScreen = false,
}: BeautifulLoaderProps) => {
    const sizeClasses = {
        sm: "h-6 w-6 border-2",
        md: "h-10 w-10 border-3",
        lg: "h-16 w-16 border-4",
    };

    const loaderContent = (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className="relative">
                {/* Outer Glow */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse bg-white",
                        size === "sm" ? "p-4" : size === "md" ? "p-8" : "p-12"
                    )}
                />
                {/* Spinner */}
                <Loader2
                    className={cn(
                        "animate-spin text-white/80",
                        size === "sm" ? "h-6 w-6" : size === "md" ? "h-10 w-10" : "h-16 w-16"
                    )}
                />
            </div>
            {text && (
                <p className="text-white/60 text-sm font-medium tracking-widest uppercase animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
};
