// 'use client'

// import { Button } from '@/components/ui/button'
// import { Menu, Search } from 'lucide-react'
// import { useState } from 'react'
// import { HeaderLogo } from './icons'
// import { NavigationDrawer } from './navigation-drawer'

// export function Navbar() {
//     const [isOpen, setIsOpen] = useState(false)

//     return (
//         <>
//             <nav className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/20">
//                 <div className="mx-auto flex h-16 container items-center justify-between px-4 sm:px-4 lg:px-4 lg:py-5">
//                     {/* Left: Hamburger Menu */}
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setIsOpen(true)}
//                         //LEARN: ICON SIZING
//                         className="text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-5 cursor-pointer"
//                         aria-label="Open menu"
//                     >
//                         <Menu className="h-5 w-5" />
//                     </Button>

//                     {/* Center: Brand Logo */}
//                     <div className="flex flex-1 justify-center">
//                         <HeaderLogo />

//                     </div>

//                     {/* Right: Search Icon */}
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         className="text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-5"
//                         aria-label="Search"
//                     >
//                         <Search className="h-5 w-5" />
//                     </Button>
//                 </div>
//             </nav>

//             {/* Navigation Drawer */}
//             <NavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
//         </>
//     )
// }

'use client'

import { Button } from '@/components/ui/button'
import { Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { HeaderLogo } from './icons'
import { NavigationDrawer } from './navigation-drawer'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    return (
        <>
            <nav className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/20">
                <div className="mx-auto flex h-16 container items-center justify-between px-4 sm:px-4 lg:px-4 lg:py-5">
                    {/* Left: Hamburger Menu */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(true)}
                        className="text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-5 cursor-pointer"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Center: Brand Logo or Search Field */}
                    <div className="flex flex-1 justify-center">
                        {isSearchOpen ? (
                            <input
                                type="text"
                                placeholder="Search..."
                                autoFocus
                                className="w-full max-w-md px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                onBlur={() => setIsSearchOpen(false)}
                            />
                        ) : (
                            <HeaderLogo />
                        )}
                    </div>

                    {/* Right: Search Icon */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-5"
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </nav>

            {/* Navigation Drawer */}
            <NavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}