"use client";

import React, { useState, useEffect } from "react";
import {
    Eye,
    MoreHorizontal,
    Plus,
    SquarePen,
    Trash2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import AddCategoryModal from "../AddCategory/AddCategory";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import Image from "next/image";
import { getCategories, deleteCategory } from "@/services/category/category";
import { ICategory } from "@/types/category.types";
import { toast } from "sonner";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CategoryView from "../CategoryView/CategoryView";
import AnalyticsOverviewSection from "../CategoryOverviewSection/CategoryOverviewSection";


const CategoryPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // 10 rows per page

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Dialog state for View
    const [openView, setOpenView] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await getCategories();
                if ("error" in res) {
                    toast.error(res.error, { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
                } else {
                    setCategories(res.data);
                }
            } catch (err: unknown) {
                console.error(err);
                toast.error("Failed to fetch categories", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Compute paginated data
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

    // Handle delete category
    const handleDelete = async (categoryId: string) => {
        setDeleting(categoryId);
        try {
            const res = await deleteCategory(categoryId);

            if ("error" in res) {
                toast.error(res.error, { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
            } else {
                toast.success(res.message, { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
                setCategories(prev => prev.filter(cat => cat._id !== categoryId));
            }
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to delete category", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
        } finally {
            setDeleting(null);
        }
    };

    // Table columns
    const categoryColumn: Column<ICategory>[] = [
        {
            header: "Image",
            accessor: "image",
            cell: (row) => {
                const imageUrl = row.image?.trim() || "";
                const isValidUrl = imageUrl.startsWith("http") || imageUrl.startsWith("/");
                return (
                    <div className="flex justify-center items-center w-12 h-12 rounded overflow-hidden bg-gray-800 text-white text-xs font-medium">
                        {isValidUrl ? (
                            <Image
                                src={imageUrl}
                                alt={row.title}
                                width={48}
                                height={48}
                                className="rounded object-cover"
                                unoptimized
                            />
                        ) : (
                            <span className="text-center px-1 truncate">{imageUrl || "-"}</span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Title",
            accessor: "title",
            cell: (row) => <span className="text-white">{row.title}</span>,
        },
        {
            header: "Description",
            accessor: "description",
            cell: (row) => <span className="text-white">{row.description || "-"}</span>,
        },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-md">
                                <MoreHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                    setSelectedCategory(row); // store the category data
                                    setOpenEdit(true);        // open the edit modal
                                }}
                            >
                                <SquarePen size={16} />
                                Edit
                            </DropdownMenuItem>


                            {/* View Button */}
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                    setSelectedCategoryId(row._id ?? null);
                                    setOpenView(true);
                                }}
                            >
                                <Eye size={16} />
                                View
                            </DropdownMenuItem>

                            {/* Delete Button */}
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

    const totalCategory = categories.length;

    return (
        <div>
            <AnalyticsOverviewSection
                totalCategory={totalCategory}
                loading={loading}
            />
            <header>
                <h1 className="text-base py-2 sm:py-5 text-white">Category Management</h1>

                <div className="flex justify-end mb-4 items-center w-full flex-wrap gap-5">

                    <Button
                        className="cursor-pointer flex items-center bg-[#1a1a1a] hover:bg-[#1a1a1a] px-4 py-2"
                        onClick={() => setOpenAdd(true)}
                    >
                        <Plus size={18} className="mr-2 text-white" />
                        <span className="text-white text-base">Add Category</span>
                    </Button>
                </div>

                <p className="text-base py-1">Category Details</p>
            </header>

            {/* Show paginated data */}
            <CustomTable columns={categoryColumn} data={currentCategories} loading={loading} />

            <CustomPagination
                totalItems={categories.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            {/* Add Category Modal */}
            <AddCategoryModal
                open={openAdd}
                onOpenChange={setOpenAdd}
                onCategoryAdded={(newCategory) =>
                    setCategories(prev => [newCategory, ...prev])
                }
            />

            {/* Edit Category Modal */}
            <AddCategoryModal
                open={openEdit}
                onOpenChange={(open) => {
                    setOpenEdit(open);
                    if (!open) setSelectedCategory(null); // reset after close
                }}
                isEdit={true}
                initialData={selectedCategory || undefined} // pass selected category
                onCategoryAdded={(updatedCategory) => {
                    setCategories((prev) =>
                        prev.map((cat) =>
                            cat._id === updatedCategory._id ? updatedCategory : cat
                        )
                    );
                }}
            />

            {/* View Category Modal */}
            <Dialog open={openView} onOpenChange={setOpenView}>
                <DialogContent className="max-w-md bg-[#1a1a1a] [&>button:first-of-type]:hidden">
                    <DialogHeader>
                        <DialogTitle>Category Details</DialogTitle>
                    </DialogHeader>
                    {selectedCategoryId && (
                        <CategoryView categoryId={selectedCategoryId} />
                    )}
                    <X
                        className="h-5 w-5 text-white cursor-pointer absolute top-4 right-3"
                        onClick={() => setOpenView(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CategoryPage;
