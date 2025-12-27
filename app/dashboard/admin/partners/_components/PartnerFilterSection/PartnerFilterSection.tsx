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

    const getSelectedCategoryId = useCallback(() => {
        if (!currentFilters.category) return "all";
        
        const foundCategory = categories.find(cat => cat.title === currentFilters.category);
        return foundCategory?._id || "all";
    }, [currentFilters.category, categories]);

    // --- Search Debouncing Logic ---
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (localSearch !== currentFilters.search) {
                onFilterChange({ search: localSearch });
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [localSearch, onFilterChange, currentFilters.search]);

    const handleCategoryChange = useCallback(
        (value: string) => {
            if (value === 'all') {
                onFilterChange({ category: undefined });
            } else {
                const selectedCategory = categories.find(cat => cat._id === value);
                onFilterChange({ category: selectedCategory?.title });
            }
        },
        [onFilterChange, categories]
    );

    return (
        <>
            {/* Category Select */}
            <Select
                onValueChange={handleCategoryChange}
                value={getSelectedCategoryId()}
            >
                <SelectTrigger className="w-full sm:w-45 bg-[#1a1a1a]! border border-gray-700 text-white h-12!">
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
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="bg-[#1a1a1a] border border-gray-700 text-white"
                />
            </div>
        </>
    );
};

export default PartnerFilterSection;