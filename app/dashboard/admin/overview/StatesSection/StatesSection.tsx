"use client";

import {
    Activity,
    DollarSign,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import StateCard from "../_components/StateCard";

import { toast } from "sonner";
// --- FIX: Import the IAdminStats interface along with the function ---
import { getAdminStats, IAdminStats } from "@/services/users/users";


const StatesSection = () => {
    // State now uses the correctly imported IAdminStats
    const [adminStats, setAdminStats] = useState<IAdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch admin stats on component mount
    useEffect(() => {
        const fetchAdminStats = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await getAdminStats();

                if ("error" in result) {
                    // Handle error response
                    console.error("Error fetching admin stats:", result.error);
                    setError(result.error);
                    toast.error(result.error);
                } else {
                    // Success - set the data
                    // console.log("Admin Stats Data:", result);
                    setAdminStats(result); // This assignment will now work without type error
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                const errorMessage = "An unexpected error occurred while fetching stats";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []); // Empty dependency array means this runs once on mount

    // --- MAPPING THE API DATA TO THE STAT CARDS ---
    const stats = [
        {
            icon: Users,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            title: "Total Partners",
            value: adminStats?.totalPartner?.toLocaleString() || "0",
        },
        {
            icon: Activity,
            iconBgColor: "bg-green-100",
            iconColor: "text-green-600",
            title: "Total Users",
            value: adminStats?.totalUser?.toLocaleString() || "0",
        },
        {
            icon: DollarSign,
            iconBgColor: "bg-teal-100",
            iconColor: "text-teal-600",
            title: "Total Categories",
            value: adminStats?.totalCategory?.toLocaleString() || "0",
        },
    ] as const;

    // Loading state
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pb-7 pt-3 sm:pt-8">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-gray-200 h-32 rounded-lg"
                    />
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">Failed to load statistics: {error}</p>
            </div>
        );
    }

    // No data state
    if (!adminStats) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-600">No statistics available</p>
            </div>
        );
    }

    // Success state - render the cards
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pb-7 pt-3 sm:pt-8">
            {stats.map((stat, index) => (
                <StateCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default StatesSection;