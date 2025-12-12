"use client";

import React, { useState } from "react";
import { Ban, CircleCheck, MoreHorizontal} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import { PartnerData } from "../data/membersData";


const MemberPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentPartners = PartnerData.slice(indexOfFirstItem, indexOfLastItem); // Paginate PartnerData

  const columns: Column<typeof PartnerData[0]>[] = [
    {
      header: "Name",
      cell: (row) => <span className="text-white">{row.userName}</span>,
    },
    {
      header: "Email",
      cell: (row) => <span className="text-white">{row.email}</span>,
    },
    {
      header: "Location",
      cell: (row) => <span className="text-white">{row.location}</span>,
    },
    {
      header: "Role",
      cell: (row) => (
        <span className="text-white">{row.role === "Provider" ? "Provider" : "Client"}</span>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : row.status === "Suspended"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: () => (
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
                
              >
                <Ban size={16} className="text-red-600"/>
                Block
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                
              >
                <CircleCheck size={16} className="text-green-500" />
                Unblock
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
        <h1 className="text-base py-2 sm:py-5 text-white">Members Management</h1>
       
      </header>

      <CustomTable columns={columns} data={currentPartners} loading={false} />

      <CustomPagination
        totalItems={PartnerData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default MemberPage;
