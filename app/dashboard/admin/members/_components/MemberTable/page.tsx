"use client";

import React, { useState } from "react";
import { MoreHorizontal, Ban, CircleCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";

import toast from "react-hot-toast";
import { IPartnerData, PartnerData } from "../data/membersData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const MemberPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
  const [ , setSelectedUser] = useState<IPartnerData | null>(null); // Use IPartnerData type

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentPartners = PartnerData.slice(indexOfFirstItem, indexOfLastItem); // Paginate PartnerData

  const handleBlockClick = (user: IPartnerData) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

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
                onClick={() => handleBlockClick(row)}
              >
                <Ban size={16} className="text-red-600" />
                Block
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleBlockClick(row)}
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
        <h1 className="text-base py-2 sm:py-5 text-white">Partners Management</h1>
      </header>

      <CustomTable columns={columns} data={currentPartners} loading={false} />

      <CustomPagination
        totalItems={PartnerData.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Block Confirmation Dialog */}
      <AlertDialog open={isBlockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure you want to block this user?</AlertDialogHeader>
          <AlertDialogDescription>
            Blocking this user will restrict their access to the platform.
          </AlertDialogDescription>
          <div className="flex justify-end space-x-2">
            <AlertDialogCancel onClick={() => setBlockDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Here you can add logic to block the user
                toast.success("User blocked successfully!");
                setBlockDialogOpen(false);
              }}
            >
              Block
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemberPage;
