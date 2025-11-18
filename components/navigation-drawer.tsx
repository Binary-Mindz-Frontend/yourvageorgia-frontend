'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, User, X } from 'lucide-react'
import { useEffect } from 'react'

interface NavigationDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const menuItems = [
        { label: 'DISCOVER', icon: null },
        { label: 'MEMBERSHIPS', icon: null },
        { label: 'PARTNERSHIPS', icon: null },
    ]

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-white/10 transition-opacity backdrop-blur-sm duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-1/2 bg-background/60 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
            >
                {/* Header */}
                <div className={`absolute top-2 ${isOpen ? '-right-16' : ' right-0 pointer-events-none opacity-0'} flex items-center justify-between border-b border-border/40 m-6`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className={`text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-5 cursor-pointer `}
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Menu Items */}
                <div className="space-y-1 md:w-2/3 ml-auto px-6 py-8 mt-28">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={onClose}
                            className="group cursor-pointer flex w-full items-center justify-between rounded-md px-4 py-4 text-sm font-light tracking-wide text-foreground transition-colors hover:bg-accent/10"
                        >
                            <span>{item.label}</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    ))}

                    {/* Bottom Actions */}
                    <div className="flex gap-4 p-4 pl-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-5 cursor-pointer"
                            aria-label="Favorites"
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-5 cursor-pointer"
                            aria-label="Account"
                        >
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
