"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  SquarePen,
  Star,
  Trash2,
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
import { getCategories } from "@/services/category/category";
import { ICategory } from "@/types/category.types";
import { toast } from "sonner";

const CategoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 10 rows per page

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

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
      cell: () => (
        <div className="flex justify-center items-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="flex items-center gap-2">
                <SquarePen size={16} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Eye size={16} />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Star size={16} />
                Make Featured
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                <Trash2 size={16} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div>
      <header>
        <h1 className="text-base py-2 sm:py-5 text-[#0A0A0A]">Category Management</h1>

        <div className="flex justify-between mb-4 items-center w-full flex-wrap gap-5">
          <div className="relative w-full sm:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-2 pl-10 text-sm bg-gray-900 border border-gray-300 rounded-lg"
              placeholder="Search Project..."
            />
          </div>

          <Button
            className="flex items-center bg-gray-900 hover:bg-[#030213] px-4 py-2"
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

      <AddCategoryModal
        open={openAdd}
        onOpenChange={setOpenAdd}
        onCategoryAdded={(newCategory) =>
          setCategories((prev) => [newCategory, ...prev])
        }
      />

      <AddCategoryModal open={openEdit} onOpenChange={setOpenEdit} isEdit />
    </div>
  );
};

export default CategoryPage;
