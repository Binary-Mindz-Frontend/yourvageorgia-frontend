"use client";

import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import React from "react";

interface AccessCodeOverviewProps {
    totalCodes: number;
    loading: boolean;
}

const AccessCodeOverviewSection: React.FC<AccessCodeOverviewProps> = ({
    totalCodes,
    loading,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
                <h3 className="text-gray-400 text-sm font-medium">Total Access Codes</h3>
                <div className="mt-2 flex items-baseline gap-2">
                    {loading ? (
                        <BeautifulLoader size="sm" />
                    ) : (
                        <span className="text-3xl font-bold text-white">{totalCodes}</span>
                    )}
                </div>
            </div>
            {/* Additional stats could be added here if the API provides them */}
        </div>
    );
};

export default AccessCodeOverviewSection;
