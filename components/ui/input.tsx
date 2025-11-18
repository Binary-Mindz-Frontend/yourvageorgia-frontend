import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // your custom login design
        "w-full px-4 py-3 bg-black border border-white/30 text-white placeholder-white/50 rounded-full focus:ring-1 focus:ring-white focus:border-white transition duration-300 shadow-lg",
        
        // shadcn base styles
        "file:text-foreground selection:bg-primary selection:text-primary-foreground",
        "dark:bg-input/30 bg-transparent shadow-xs outline-none",
        "transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:border-white",

        // error state
        "aria-invalid:border-destructive aria-invalid:ring-destructive/40",

        className
      )}
      {...props}
    />
  )
}

export { Input }
