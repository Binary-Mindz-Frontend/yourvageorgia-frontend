"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CategoryItem {
  name: string;
  jobs: number;        
  percentage?: number;
}

interface TopCategoriesProps {
  title?: string;
  categories?: CategoryItem[]; 
  totalCategories?: number;
  showViewAll?: boolean;
}

const TopCategories = ({
  title = "Top Categories",
  categories,
  totalCategories = 12,
  showViewAll = true,
}: TopCategoriesProps) => {
  const [selectedPeriod] = useState("This month");

  // Default categories if none provided
  const defaultCategories: CategoryItem[] = [
    { name: "Home Improvement", jobs: 200, percentage: 66 },
    { name: "Cleaning Services", jobs: 300, percentage: 100 },
    { name: "Health & Wellness", jobs: 100, percentage: 33 },
    { name: "Events & Entertainment", jobs: 80, percentage: 26 },
    { name: "Education & Training", jobs: 200, percentage: 66 },
  ];

  const categoryList = categories || defaultCategories;

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold ">{title}</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          {selectedPeriod}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {categoryList.map((category, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            
            {/* Category Name */}
            <div className="w-40 xs:w-60 sm:w-68 md:w-90 lg:w-44">
              <p className="text-sm font-medium text-gray-300">
                {category.name}
              </p>
            </div>

            {/* Jobs Count */}
            <div className="text-right">
              <p className="text-xs text-gray-300">{category.jobs} jobs</p>
            </div>

            {/* Progress Bar */}
            <div className="flex-1">
              <div className="w-full h-2 bg-[#C5D2E8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00A896] rounded-full transition-all duration-300"
                  style={{ width: `${category.percentage || 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-300">
            Total Categories{" "}
            <span className="ml-1 font-semibold text-gray-300">
              {totalCategories}
            </span>
          </p>
          {showViewAll && (
            <button className="flex items-center gap-2 px-6 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              View all
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
