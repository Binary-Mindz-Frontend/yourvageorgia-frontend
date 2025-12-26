"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Partner } from "@/types/partner.types";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange?: (filters: {
    locations: string[];
    activities: string[];
  }) => void;
  partners: Partner[];
}

export function FilterDrawer({
  isOpen,
  onClose,
  onFilterChange,
  partners,
}: FilterDrawerProps) {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isLocationsOpen, setIsLocationsOpen] = useState(true);
  const [isActivityOpen, setIsActivityOpen] = useState(true);

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

  // Extract unique areas from partners' contacts
  const locations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    partners.forEach((partner) => {
      if (partner.contacts && Array.isArray(partner.contacts)) {
        partner.contacts.forEach((contact) => {
          const area = contact.area || contact.address;
          if (area) {
            uniqueLocations.add(area);
          }
        });
      }
    });
    return ["ALL", ...Array.from(uniqueLocations).sort()];
  }, [partners]);

  // Extract unique activities from partners (using the activity field)
  const activities = useMemo(() => {
    const uniqueActivities = new Set<string>();
    partners.forEach((partner) => {
      // Use the activity field from the API response
      if (partner.activity && Array.isArray(partner.activity)) {
        partner.activity.forEach((act) => {
          if (typeof act === 'object' && act !== null && 'title' in act) {
            const activityObj = act as { title: string };
            uniqueActivities.add(activityObj.title);
          }
        });
      }
    });
    return ["ALL", ...Array.from(uniqueActivities).sort()];
  }, [partners]);

  const handleLocationToggle = (location: string) => {
    if (location === "ALL") {
      setSelectedLocations([]);
    } else {
      setSelectedLocations((prev) =>
        prev.includes(location)
          ? prev.filter((l) => l !== location)
          : [...prev, location]
      );
    }
  };

  const handleActivityToggle = (activity: string) => {
    if (activity === "ALL") {
      setSelectedActivities([]);
    } else {
      setSelectedActivities((prev) =>
        prev.includes(activity)
          ? prev.filter((a) => a !== activity)
          : [...prev, activity]
      );
    }
  };

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        locations: selectedLocations,
        activities: selectedActivities,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocations, selectedActivities]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/10 transition-opacity backdrop-blur-sm duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Frame */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-1/2 bg-background/60 transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <div
          className={`absolute top-4 -left-16 flex items-center justify-between px-6 py-6 ${isOpen ? "-right-16" : "left-0"
            }`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`text-foreground hover:bg-accent/10 [&_svg:not([class*='size-'])]:size-6 cursor-pointer ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Inner Container */}
        <div className="h-full w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Content */}
          <div className="space-y-1 md:w-2/3 mr-auto sm:px-6 py-8 mt-28">
            {/* Locations Section */}
            <div className="pb-6">
              <button
                onClick={() => setIsLocationsOpen(!isLocationsOpen)}
                className="flex items-center justify-between w-full text-foreground font-medium text-sm tracking-wider mb-4 px-4 py-2"
              >
                LOCATION
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isLocationsOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isLocationsOpen && (
                <div className="space-y-1">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationToggle(location)}
                      className={`block cursor-pointer w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-colors ${location === "ALL" && selectedLocations.length === 0
                          ? "bg-[#73737366] text-white"
                          : selectedLocations.includes(location)
                            ? "bg-[#73737366] text-white"
                            : "text-foreground hover:bg-accent/10"
                        }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Section */}
            <div className="pb-4">
              <button
                onClick={() => setIsActivityOpen(!isActivityOpen)}
                className="flex items-center justify-between w-full text-foreground font-medium text-sm tracking-wider mb-4 px-4 py-2"
              >
                ACTIVITY
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isActivityOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isActivityOpen && (
                <div className="space-y-1">
                  {activities.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => handleActivityToggle(activity)}
                      className={`block cursor-pointer w-full text-left px-4 py-3  text-sm font-light tracking-wide transition-colors ${activity === "ALL" && selectedActivities.length === 0
                          ? "bg-[#73737366] text-white"
                          : selectedActivities.includes(activity)
                            ? "bg-[#73737366] text-white"
                            : "text-foreground hover:bg-accent/10"
                        }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}