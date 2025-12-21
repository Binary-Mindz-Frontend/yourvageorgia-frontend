'use client'

import { Button } from "@/components/ui/button";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { HeaderLogo } from "./icons";
import { useRouter } from "next/navigation";
import { NavigationDrawer } from "./navigation-drawer";
import Image from "next/image";
import PartnerDetailsModal from "@/app/(main)/network/_components/NetworkCardModal/PartnerDetailsModal";

interface Partner {
  _id: string;
  name: string;
  category: {
    title: string;
  };
  thumbnail: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const fetchPartners = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BASE_API;
      const response = await fetch(`${apiUrl}/partner`, {
        cache: 'no-store', // Prevent caching
      });
      const data = await response.json();
      if (data.success) {
        setPartners(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch partner data:", error);
    }
  };

  fetchPartners();
}, [])

  const filteredPartners = useMemo(() => {
    if (!searchQuery) return partners;
    return partners.filter(
      (partner) =>
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.category?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, partners]);

  const handleSearch = () => {
    if (searchQuery) {
      router.push(`/network?search=${searchQuery}`);
    }
  };

  const handlePartnerClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
    setIsSearchOpen(false); // ADD THIS LINE: Close search results when card is clicked
  };

  // Handle click outside to close search results
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const target = event.target as HTMLElement;
  //     const searchContainer = document.querySelector('.search-container');
  //     const searchResults = document.getElementById('search-results-container');

  //     // If click is outside both search input and results, close search
  //     if (
  //       isSearchOpen &&
  //       searchContainer &&
  //       !searchContainer.contains(target) &&
  //       searchResults &&
  //       !searchResults.contains(target)
  //     ) {
  //       setIsSearchOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, [isSearchOpen]);
  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchContainer = document.querySelector('.search-container');
      const searchResults = document.getElementById('search-results-container');
      const searchToggleButton = document.querySelector('[aria-label="Close Search"], [aria-label="Open Search"]');

      // If click is outside search input, results, AND the toggle button, close search
      if (
        isSearchOpen &&
        searchContainer &&
        !searchContainer.contains(target) &&
        searchResults &&
        !searchResults.contains(target) &&
        searchToggleButton &&
        !searchToggleButton.contains(target)
      ) {
        setIsSearchOpen(false);
        setSearchQuery(""); // Clear search when closing
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  return (
    <>
      <nav
        className={`
          sticky top-0 z-20 w-full transition-all duration-300 ease-in-out
          ${scrolled
            ? "bg-background/50 backdrop-blur-md border-b border-border/40 shadow-sm py-2"
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
          <div className="flex justify-center items-center px-4 transition-all duration-300 search-container">
            {isSearchOpen ? (
              <div className="relative flex items-center lg:w-125 animate-in fade-in zoom-in-95 duration-200">
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 pr-14 py-3 rounded-full bg-background/80 backdrop-blur-sm border-2 border-border/50 hover:border-border focus:outline-none focus:ring-[1px] focus:ring-primary/15 focus:border-primary text-sm transition-all duration-200 shadow-lg shadow-black/5"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsSearchOpen(false);
                    if (e.key === "Enter") handleSearch();
                  }}
                />

                {isSearchOpen && (
                  <span
                    onClick={handleSearch}
                    
                    className="absolute right-1 cursor-pointer px-4"
                  >
                    <Search className=" h-4 w-4" />
                    
                  </span>
                )}
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
            // onClick={() => setIsSearchOpen(!isSearchOpen)}
            onClick={() => {
              if (isSearchOpen) {
                setIsSearchOpen(false);
                setSearchQuery(""); // Optional: clear search query when closing
              } else {
                setIsSearchOpen(true);
              }
            }}
            className="text-foreground hover:bg-accent/20 transition-colors [&_svg:not([class*='size-'])]:size-5 cursor-pointer"
            aria-label={isSearchOpen ? "Close Search" : "Open Search"}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Partner Cards Display Below Search */}
      {isSearchOpen && (
        <div
          id="search-results-container"
          className="mt-4 space-y-4 max-w-xl mx-auto bg-black absolute left-0 right-0 z-10 border backdrop-blur-md p-4 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {filteredPartners.length === 0 ? (
            <div className="text-center text-white opacity-70 py-4">
              No results found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPartners.map((partner) => (
                <div
                  key={partner._id}
                  onClick={() => handlePartnerClick(partner)}
                  className="flex items-center border space-x-4 p-3 bg-accent/10 rounded-lg shadow-md cursor-pointer hover:bg-accent/20 transition-colors"
                >
                  <Image
                    width={48}
                    height={48}
                    src={partner.thumbnail}
                    alt={partner.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base font-semibold">{partner.name}</h3>
                    <p className="text-xs text-gray-400">
                      {partner.category?.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Partner Modal */}
      {isModalOpen && selectedPartner && (
        <PartnerDetailsModal
          partner={selectedPartner}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <NavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}