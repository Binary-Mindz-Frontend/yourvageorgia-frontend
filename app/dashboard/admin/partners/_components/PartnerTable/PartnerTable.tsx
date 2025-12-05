"use client";

import React, { useState, useEffect } from "react";
import { Eye, MoreHorizontal, Pen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import { toast } from "sonner";
import { getPartners, deletePartner } from "@/services/partner/partner";
import { Partner } from "@/types/partner.types";
import { useRouter } from "next/navigation";

const toastStyle = { background: "#000", color: "#fff", marginTop: "4rem" };

const PartnerPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const res = await getPartners();
        if ("error" in res) {
          toast.error(res.error, { style: toastStyle });
        } else {
          setPartners(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch partners", { style: toastStyle });
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentPartners = partners.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (partnerId: string) => {
    setDeleting(partnerId);
    try {
      const res = await deletePartner(partnerId);
      if ("error" in res) {
        toast.error(res.error, { style: toastStyle });
      } else {
        toast.success(res.message, { style: toastStyle });
        setPartners(prev => prev.filter(p => p._id === partnerId ? false : true));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete partner", { style: toastStyle });
    } finally {
      setDeleting(null);
    }
  };

  const columns: Column<Partner>[] = [
    {
      header: "Name",
      cell: (row) => <span className="text-white">{row.name}</span>,
    },
    {
      header: "Category",
      cell: (row) => (
        <span className="text-white">
          {typeof row.category === "string" ? row.category : row.category?.title}
        </span>
      ),
    },
    {
      header: "Address",
      cell: (row) => <span className="text-white">{row.address}</span>,
    },
    {
      header: "Is Featured",
      cell: (row) => (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${row.isFeatured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
          >
            {row.isFeatured ? "Yes" : "No"}
          </span>
        </div>
      ),
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
      <header className="flex justify-between items-center mb-4 flex-wrap gap-5">
        <h1 className="text-base py-2 sm:py-5 text-[#0A0A0A]">Partners Management</h1>
        <Button
          className="flex cursor-pointer items-center bg-gray-900 hover:bg-[#030213] px-4 py-2"
          onClick={() => router.push("/dashboard/admin/partners/AddPartners")}
        >
          <Plus size={18} className="mr-2 text-white" />
          <span className="text-white text-base">Add Partner</span>
        </Button>
      </header>

      <CustomTable columns={columns} data={currentPartners} loading={loading} />

      <CustomPagination
        totalItems={partners.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PartnerPage;
