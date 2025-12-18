"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IPartnerFilters } from "../PartnerTable/PartnerTable";

// Define the structure of the category object passed from the parent
interface Category {
    _id: string;
    title: string;
    // Add other relevant properties if necessary
}

interface PartnerFilterSectionProps {
    categories: Category[];
    currentFilters: IPartnerFilters;
    onFilterChange: (filters: Partial<IPartnerFilters>) => void;
}

const PartnerFilterSection: React.FC<PartnerFilterSectionProps> = ({
    categories,
    currentFilters,
    onFilterChange,
}) => {
    // Local state for the search input (allows immediate UI update)
    const [localSearch, setLocalSearch] = useState(currentFilters.search);

    // --- Search Debouncing Logic ---
    useEffect(() => {
        // Debounce timer: waits 500ms after the user stops typing
        const delaySearch = setTimeout(() => {
            // Only update parent filters if the value has actually changed
            if (localSearch !== currentFilters.search) {
                onFilterChange({ search: localSearch });
            }
        }, 500);

        // Cleanup function: clear the timer if localSearch changes before 500ms is up
        return () => clearTimeout(delaySearch);
    }, [localSearch, onFilterChange, currentFilters.search]);
    // --------------------------------

    const handleCategoryChange = useCallback(
        (value: string) => {
            // Maps 'all' to undefined, which is what the API likely needs for no filter
            const categoryId = value === 'all' ? undefined : value;
            onFilterChange({ category: categoryId });
        },
        [onFilterChange]
    );

    return (
        <>
            {/* Category Select */}
            <Select
                onValueChange={handleCategoryChange}
                value={currentFilters.category || "all"} // Display 'all' if category is undefined
            >
                <SelectTrigger className="w-full sm:w-[180px] bg-[#1a1a1a] border border-gray-700 text-white h-12!">
                    <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border border-gray-700 text-white">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                            {cat.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Debounced Search Bar */}
            <div className="relative w-full max-w-xs">
                <Input
                    type="text"
                    placeholder="Search partners by title..."
                    value={localSearch}
                    // Update local state immediately on keystroke
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="bg-[#1a1a1a] border border-gray-700 text-white"
                />
            </div>
        </>
    );
};

export default PartnerFilterSection;