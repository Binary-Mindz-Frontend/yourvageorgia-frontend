/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/auth";
import { ArrowRight, CircleUserRound, Heart, LogIn, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const [user, setUser] = useState<any>(null);
  console.log('user',user)
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuItems = [
    { label: "DISCOVER", href: "/network", icon: null },
    { label: "MEMBERSHIPS", href: "/become-member", icon: null },
    { label: "PARTNERSHIPS", href: "/partnership", icon: null },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/10 transition-opacity backdrop-blur-sm duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-1/2 bg-background/60 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div
          className={`absolute top-4 flex items-center justify-between border-b border-border/40 px-6 py-6 ${
            isOpen ? "-right-16" : "right-0"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-5 cursor-pointer ${
              isOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <div className="space-y-1 md:w-2/3 ml-auto sm:px-6 py-8 mt-28">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} passHref>
              <button
                onClick={onClose}
                className="group cursor-pointer flex w-full items-center justify-between rounded-md px-4 py-4 text-sm font-light tracking-wide text-foreground transition-colors hover:bg-accent/10"
              >
                <span>{item.label}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          ))}

          {/* Icon items as Menu Links */}
          <div className="flex items-center">
           {!user ? (
              <Link href="/login" passHref>
                <button
                  onClick={onClose}
                  className="group cursor-pointer flex w-full items-center justify-between rounded-md px-4 py-4 text-sm font-light tracking-wide text-foreground transition-colors hover:bg-accent/10"
                >
                  <User className="h-5 w-5" />
                </button>
              </Link>
            ) : (
              <Link href="/profile" passHref className="ml-2">
                <button
                  onClick={onClose}
                  className="group cursor-pointer border rounded-full flex w-full items-center justify-between p-1.5 text-sm font-light tracking-wide text-foreground transition-colors hover:bg-accent/10"
                >
                  {/* <User className="h-5 w-5" /> */}
                  <CircleUserRound className="h-5 w-5" />
                </button>
              </Link>
            )}
            <Link href="/my-edit" passHref>
              <button
                onClick={onClose}
                className="group cursor-pointer flex w-full items-center justify-between rounded-md px-4 py-4 text-sm font-light tracking-wide text-foreground transition-colors hover:bg-accent/10"
              >
                <Heart className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
