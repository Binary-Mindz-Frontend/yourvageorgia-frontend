// 'use client'

// import { Button } from '@/components/ui/button'
// import { Menu, Search } from 'lucide-react'
// import Link from 'next/link'
// import { useState } from 'react'
// import { HeaderLogo } from './icons'
// import { NavigationDrawer } from './navigation-drawer'

// export function Navbar() {
//     const [isOpen, setIsOpen] = useState(false)
//     const [isSearchOpen, setIsSearchOpen] = useState(false)

//     return (
//         <>
//             <nav className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/20">
//                 <div className="mx-auto flex h-16 container min-w-full items-center justify-between px-4 sm:px-4 lg:px-12 lg:py-5">
//                     {/* Left: Hamburger Menu */}
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setIsOpen(true)}
//                         className="text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-6 cursor-pointer"
//                         aria-label="Open menu"
//                     >
//                         <Menu className="h-6 w-6" />
//                     </Button>

//                     {/* Center: Brand Logo or Search Field */}
//                     <div className="flex flex-1 justify-center">
//                         {isSearchOpen ? (
//                             <input
//                                 type="text"
//                                 placeholder="Search..."
//                                 autoFocus
//                                 className="w-full max-w-md px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
//                                 onBlur={() => setIsSearchOpen(false)}
//                             />
//                         ) : (
//                             <Link href="/"><HeaderLogo /></Link>
//                         )}
//                     </div>

//                     {/* Right: Search Icon */}
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setIsSearchOpen(!isSearchOpen)}
//                         className="text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-6 cursor-pointer"
//                         aria-label="Search"
//                     >
//                         <Search className="h-6 w-6" />
//                     </Button>
//                 </div>
//             </nav>

//             {/* Navigation Drawer */}
//             <NavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
//         </>
//     )
// }

'use client'

import { Button } from '@/components/ui/button';
import { Menu, Search, X } from 'lucide-react'; // Added X icon for better Search UX
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HeaderLogo } from './icons';
import { NavigationDrawer } from './navigation-drawer';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // UX Logic: Detect scroll to change navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <nav
                className={`
                    sticky top-0 z-20 w-full transition-all duration-300 ease-in-out
                    ${scrolled
                        ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm py-2"
                        : "bg-transparent py-4 border-transparent"
                    }
                `}
            >
                <div className="mx-auto flex h-12 container min-w-full items-center justify-between px-4 sm:px-6 lg:px-12">

                    {/* Left: Hamburger Menu */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(true)}
                        className="text-foreground hover:bg-accent/20 transition-colors [&_svg:not([class*='size-'])]:size-5 cursor-pointer"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Center: Brand Logo or Search Field */}
                    <div className="flex flex-1 justify-center items-center px-4 transition-all duration-300">
                        {isSearchOpen ? (
                            <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    autoFocus
                                    className="w-full px-4 py-2 rounded-full bg-accent/10 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm transition-all"
                                    // UX Improvement: Allow Escape key to close
                                    onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                                    onBlur={(e) => {
                                        // Only close if the related target (what we clicked) isn't the search toggle button
                                        if (!e.relatedTarget) setIsSearchOpen(false);
                                    }}
                                />
                            </div>
                        ) : (
                            <Link
                                href="/"
                                className="transition-opacity hover:opacity-80 duration-200"
                            >
                                <HeaderLogo />
                            </Link>
                        )}
                    </div>

                    {/* Right: Search Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="text-foreground hover:bg-accent/20 transition-colors [&_svg:not([class*='size-'])]:size-5 cursor-pointer"
                        aria-label={isSearchOpen ? "Close Search" : "Open Search"}
                    >
                        {/* UX Improvement: Icon swaps based on state */}
                        {isSearchOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </nav>

            <NavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}