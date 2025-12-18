// components/Shared/dashboard/FilterSection.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSectionProps {
  onFilterChange: (filters: Record<string, string | boolean>) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    isMembership: "",
    isBlocked: "",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback((name: string, selectedValue: string) => {
    
    const valueToSet = selectedValue === "all" ? "" : selectedValue;
    
    setFilters((prev) => ({
      ...prev,
      [name]: valueToSet,
    }));
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="filter-section flex flex-wrap gap-3 w-full justify-end sm:flex-row sm:w-auto">
      
      {/* 1. Search Input: Added py-3 and h-12 for height */}
      <Input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleInputChange}
        placeholder="Search by Name"
        className="w-full sm:w-auto min-w-[150px]"
      />
      
      {/* 2. Role Select */}
      <Select
        value={filters.role}
        onValueChange={(value) => handleSelectChange("role", value)}
      >
        {/* Added h-12 for guaranteed height */}
        <SelectTrigger className="w-full sm:w-[150px] h-12!">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent >
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      {/* 3. Membership Select */}
      <Select
        value={filters.isMembership}
        onValueChange={(value) => handleSelectChange("isMembership", value)}
      >
        {/* Added h-12 for guaranteed height */}
        <SelectTrigger className="w-full sm:w-[150px] h-12!">
          <SelectValue placeholder="Membership" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Memberships</SelectItem>
          <SelectItem value="true">Member (True)</SelectItem>
          <SelectItem value="false">Inactive (False)</SelectItem>
        </SelectContent>
      </Select>

      {/* 4. Blocked Select */}
      <Select
        value={filters.isBlocked}
        onValueChange={(value) => handleSelectChange("isBlocked", value)}
      >
        {/* Added h-12 for guaranteed height */}
        <SelectTrigger className="w-full sm:w-[150px] h-12!">
          <SelectValue placeholder="Blocked Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="true">Blocked (True)</SelectItem>
          <SelectItem value="false">Not Blocked (False)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSection;