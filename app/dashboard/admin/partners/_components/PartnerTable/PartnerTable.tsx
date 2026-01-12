"use client";

import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    deletePartner,
    getPartners,
    IGetPartnersParams,
} from "@/services/partner/partner";
import { Eye, MoreHorizontal, Pen, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getCategoriesForSelect, ICategoryWithId } from "@/services/category/category";
import { Partner } from "@/types/partner.types";
import { useRouter } from "next/navigation";
import PartnerFilterSection from "../PartnerFilterSection/PartnerFilterSection";
import PartnerPositionDialog from "../PartnerPositionDialog/PartnerPositionDialog";
import UsersSummary from "../UsersSummarySection/UsersSummary";


type PartnerRow = Partner & {
    categories?: (ICategoryWithId | string)[] | ICategoryWithId | string;
    _id: string;
};

export interface IPartnerFilters {
    search: string;
    category: string | undefined;
    limit: number;
    page: number;
}

const pageSize = 10;

const PartnerPage = () => {
    const router = useRouter();

    // 1. 💡 NEW STATE: Global Total Counts (UNFILTERED)
    const [globalTotalPartners, setGlobalTotalPartners] = useState(0);
    const [globalFeaturedPartners, setGlobalFeaturedPartners] = useState(0);
    const [globalLoading, setGlobalLoading] = useState(true); // Loading state for the summary

    // Centralized state for all filtering and pagination parameters (FOR THE TABLE)
    const [filters, setFilters] = useState<IPartnerFilters>({
        search: "",
        category: undefined,
        limit: pageSize,
        page: 1,
    });

    const [partners, setPartners] = useState<PartnerRow[]>([]);
    const [categories, setCategories] = useState<ICategoryWithId[]>([]);
    const [filteredTotalItems, setFilteredTotalItems] = useState(0); // Total items for the CURRENTLY FILTERED TABLE
    const [tableLoading, setTableLoading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
    const [partnerToUpdatePosition, setPartnerToUpdatePosition] = useState<PartnerRow | null>(null);

    // Add this before the columns definition
    const getCategoryTitles = (
        categoryData: (ICategoryWithId | string)[] | ICategoryWithId | string | undefined,
        allCategories: ICategoryWithId[]
    ): string => {
        if (!categoryData) return "N/A";

        // Case 1: Array
        if (Array.isArray(categoryData)) {
            return categoryData
                .map(cat => {
                    if (typeof cat === "object" && "title" in cat) {
                        return cat.title;
                    }
                    if (typeof cat === "string") {
                        return allCategories.find(c => c._id === cat)?.title || "N/A";
                    }
                    return "N/A";
                })
                .join(", ");
        }

        // Case 2: Single object
        if (typeof categoryData === "object" && "title" in categoryData) {
            return categoryData.title;
        }

        // Case 3: Single string (ID)
        if (typeof categoryData === "string") {
            return allCategories.find(c => c._id === categoryData)?.title || "N/A";
        }

        return "N/A";
    };

    // Function to get the GLOBAL, UNFILTERED COUNTS (Runs once on mount)
    const fetchGlobalCounts = useCallback(async () => {
        setGlobalLoading(true);
        try {

            const params: IGetPartnersParams = { limit: 10000 }; // Get a large enough limit or use a dedicated stats endpoint

            const res = await getPartners(params);

            if ("error" in res) {
                toast.error(res.error);
            } else {
                const allPartners = res.data as PartnerRow[];
                setGlobalTotalPartners(res.meta.total || allPartners.length);

                const featuredCount = allPartners.filter((p) =>
                    p.isFeatured === true ||
                    (typeof p.isFeatured === "string" && p.isFeatured === "true")
                ).length;
                setGlobalFeaturedPartners(featuredCount);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch summary stats");
        } finally {
            setGlobalLoading(false);
        }
    }, []);

    // 1. Fetch Categories and Global Counts on Mount
    useEffect(() => {
        fetchCategoriesList();
        fetchGlobalCounts();
    }, [fetchGlobalCounts]);

    const fetchCategoriesList = async () => {
        try {
            const res = await getCategoriesForSelect();
            // console.log(res)
            if ("error" in res) {
                toast.error(res.error);
            } else {
                setCategories(res.data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch categories list");
        }
    };

    // 2. Filtered Partner Data Fetching (Uses `filters` state for the table)
    const fetchPartners = useCallback(async () => {
        setTableLoading(true);
        try {
            const params: IGetPartnersParams = {
                limit: filters.limit,
                page: filters.page,
                search: filters.search,
                category: filters.category,
            };

            const res = await getPartners(params);
            // console.log(res, "res");
            if ("error" in res) {
                toast.error(res.error);
            } else {
                setPartners(res.data as PartnerRow[]);
                setFilteredTotalItems(res?.meta?.total || 0);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch partners");
        } finally {
            setTableLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    const handleFilterChange = useCallback(
        (newFilters: Partial<IPartnerFilters>) => {
            setFilters((prev) => ({
                ...prev,
                ...newFilters,
                page: 1,
            }));
        },
        []
    );

    // Handler for Pagination change (updates only page in `filters` state)
    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({
            ...prev,
            page: newPage,
        }));
    };

    // --- 3. NEW DIALOG HANDLERS ---
    const handleOpenPositionDialog = (partner: PartnerRow) => {
        setPartnerToUpdatePosition(partner);
        setIsPositionDialogOpen(true);
    };

    const handlePositionUpdateSuccess = () => {
        // Refetch the table data to show the updated position
        fetchPartners();
    };

    const handleDelete = async (partnerId: string) => {
        setDeleting(partnerId);
        try {
            const res = await deletePartner(partnerId);
            if ("error" in res) {
                toast.error(res.error);
            } else {
                toast.success(res.message);
                fetchPartners();
                fetchGlobalCounts();
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete partner");
        } finally {
            setDeleting(null);
        }
    };

    // Columns Definition
    const columns: Column<PartnerRow>[] = [
        {
            header: "Name",
            cell: (row) => <span className="text-white">{row.name}</span>,
        },
        {
            header: "Category",
            cell: (row) => (
                <span className="text-white">
                    {getCategoryTitles(row.categories, categories)}
                </span>
            ),
        },

        {
            header: "Is Featured",
            cell: (row) => {
                const isFeatured =
                    row.isFeatured === true ||
                    (typeof row.isFeatured === "string" && row.isFeatured === "true");

                return (
                    <div className="flex justify-center">
                        <span
                            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${isFeatured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                        >
                            {isFeatured ? "Yes" : "No"}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            cell: (row) => (
                <div className="flex justify-center w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-md">
                                <MoreHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => router.push(`/dashboard/admin/partners/view/${row._id}`)}
                            >
                                <Eye size={16} />
                                View
                            </DropdownMenuItem>

                            {/* --- HANGE POSITION MENU ITEM --- */}
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => handleOpenPositionDialog(row)}
                            >
                                <Pen size={16} />
                                Change Position
                            </DropdownMenuItem>
                            {/* ---------------------------------------------- */}

                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => router.push(`/dashboard/admin/partners/AddPartners/edit/${row._id}`)}
                            >
                                <Pen size={16} />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600"
                                onClick={() => row._id && handleDelete(row._id)}
                                disabled={deleting === row._id || !row._id}
                            >
                                <Trash2 size={16} />
                                {deleting === row._id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <div>
            <UsersSummary

                totalPartners={globalTotalPartners}
                featuredPartners={globalFeaturedPartners}
                loading={globalLoading}
            />

            <header className="flex justify-between items-center mb-4 flex-wrap gap-5">
                <h1 className="text-base py-2 sm:py-5 text-white">Partners Management</h1>
                <Button
                    className="flex cursor-pointer items-center bg-[#1a1a1a] hover:bg-[#1a1a1a] px-4 py-2"
                    onClick={() => router.push("/dashboard/admin/partners/AddPartners")}
                >
                    <Plus size={18} className="mr-2 text-white" />
                    <span className="text-white text-base">Add Partner</span>
                </Button>
            </header>

            <div className="mb-6 flex flex-wrap justify-end gap-4">
                <PartnerFilterSection
                    categories={categories}
                    currentFilters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <CustomTable columns={columns} data={partners} loading={tableLoading} />

            <CustomPagination
                totalItems={filteredTotalItems}
                pageSize={pageSize}
                currentPage={filters.page}
                onPageChange={handlePageChange}
            />

            {/* --- RENDER THE DIALOG COMPONENT --- */}
            <PartnerPositionDialog
                partner={partnerToUpdatePosition}
                open={isPositionDialogOpen}
                onOpenChange={setIsPositionDialogOpen}
                onUpdateSuccess={handlePositionUpdateSuccess}
            />
        </div>
    );
};

export default PartnerPage;