"use client";
import { Ban, CircleCheck, CircleX, Eye, Mail, MoreHorizontal, Play, Search, Shield, Star } from "lucide-react";
import React, { useState } from "react";
import CustomTable, { Column } from "@/components/shared/dashboard/CustomTable/CustomTable";
import CustomPagination from "@/components/shared/dashboard/CustomPagination/CustomPagination";
import { IPartnerData, PartnerData } from "../../data/usersData";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"


const UserTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    const userColumns: Column<IPartnerData>[] = [
        {
            header: "User Info",
            cell: (row) => (
                <div className="flex flex-col items-left">
                    <p className="text-sm text-[#0A0A0A]">{row.userName}</p>
                    <p className="text-sm text-[#717182]">{row.email}</p>
                </div>
            ),
        },
        {
            header: "Role",
            cell: (row) => (
                <div className="flex justify-center">
                    <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.role === "Client"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-800"
                            }`}
                    >
                        {row.role}
                    </span>
                </div>
            ),
        },
        {
            header: "Status",
            cell: (row) => {
                let colorClass = "";

                switch (row.status) {
                    case "Active":
                        colorClass = "bg-green-100 text-green-800";
                        break;
                    case "Suspended":
                        colorClass = "bg-red-100 text-red-800";
                        break;
                    case "Pending":
                        colorClass = "bg-violet-100 text-violet-600";
                        break;
                    default:
                        colorClass = "bg-gray-100 text-gray-800";
                }

                return (
                    <div className="flex justify-center">
                        <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
                        >
                            {row.status}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Compliance",
            cell: (row) => {
                const items = row.compliance;

                return (
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2">
                            {items.idVerification ? (
                                <CircleCheck size={16} className="text-green-500" />
                            ) : (
                                <CircleX size={16} className="text-red-500" />
                            )}

                            {items.addressVerification ? (
                                <CircleCheck size={16} className="text-green-500" />
                            ) : (
                                <CircleX size={16} className="text-red-500" />
                            )}

                            {items.bankVerification ? (
                                <CircleCheck size={16} className="text-green-500" />
                            ) : (
                                <CircleX size={16} className="text-red-500" />
                            )}

                            {items.portfolioCheck ? (
                                <CircleCheck size={16} className="text-green-500" />
                            ) : (
                                <CircleX size={16} className="text-red-500" />
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Performance",
            cell: (row) => (
                <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#0A0A0A]">
                            Jobs: {row.performance.jobsPosted}
                        </span>

                        {row.performance.rating && (
                            <div className="flex items-center">
                                <Star size={12} className="text-yellow-400 fill-current" />
                                <span className="ml-1 text-xs text-gray-500">
                                    {row.performance.rating}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: "Escrow",
            cell: (row) => (
                <div className="flex justify-center">
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-[#0A0A0A]">
                            Held: {row.performance.earned}
                        </span>
                        <p className="text-gray-400">
                            Pending: {row.performance.pending}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Joined",
            accessor: "joined",
            cell: (row) => (
                <div className="flex justify-center">{row.joined}</div>
            ),
        },
        {
            header: "Location",
            accessor: "location",
            cell: (row) => (
                <div className="flex justify-center">{row.location}</div>
            ),
        },

        {
            header: "Actions",
            cell: (row) => {
                const isActive = row.status === "Active";
                const isSuspended = row.status === "Suspended";

                return (
                    <div className="w-full flex justify-center">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button
                                    aria-label="Open menu"
                                    className="p-2 rounded-md border bg-white hover:bg-gray-100"
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-48" align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                <DropdownMenuGroup>
                                    {/* Active → Suspend */}
                                    {isActive && (
                                        <DropdownMenuItem
                                            className="flex items-center gap-2 cursor-pointer"
                                            onClick={() => console.log("Suspend user")}
                                        >
                                            <Ban size={14} className="text-red-600" />
                                            <span>Suspend</span>
                                        </DropdownMenuItem>
                                    )}

                                    {/* Suspended → Activate */}
                                    {isSuspended && (
                                        <DropdownMenuItem
                                            className="flex items-center gap-2 cursor-pointer"
                                            onClick={() => console.log("Activate user")}
                                        >
                                            <Play size={14} className="text-green-700" />
                                            <span>Activate</span>
                                        </DropdownMenuItem>
                                    )}

                                    {/* Email */}
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => console.log("Email user")}
                                    >
                                        <Mail size={14} className="text-[#0A0A0A]" />
                                        <span>Email</span>
                                    </DropdownMenuItem>

                                    {/* Escrow */}
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => console.log("Escrow")}
                                    >
                                        <Eye size={14} className="text-[#0A0A0A]" />
                                        <span>Escrow</span>
                                    </DropdownMenuItem>

                                    {/* Verify */}
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => console.log("Verify")}
                                    >
                                        <Shield size={14} className="text-blue-600" />
                                        <span>Verify</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        }


    ];

    return (
        <div>
            <header className="flex items-center justify-between mb-8 flex-wrap gap-5">
                <div className="w-full bg-white px-4 pt-2 pb-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center">
                    {/* Search Input */}
                    <div className="relative w-full lg:w-1/3 min-w-[250px]">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by name, email, job ID, location..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring- focus:ring-gray-600"
                        />
                    </div>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">

  {/* Role Filter */}
  <Select>
    <SelectTrigger
      className="w-full px-2 py-2 text-sm text-[#0A0A0A]
                 border border-gray-300 rounded-lg bg-gray-50
                 focus:outline-none focus:ring-0 focus:ring-offset-0
                 shadow-none"
    >
      <SelectValue placeholder="All Roles" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">All Roles</SelectItem>
      <SelectItem value="provider">Provider</SelectItem>
      <SelectItem value="client">Client</SelectItem>
    </SelectContent>
  </Select>

  {/* Verification Filter */}
  <Select>
    <SelectTrigger
      className="w-full px-2 py-2 text-sm text-[#0A0A0A]
                 border border-gray-300 rounded-lg bg-gray-50
                 focus:outline-none focus:ring-0 focus:ring-offset-0
                 shadow-none"
    >
      <SelectValue placeholder="All Verification" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">All Verification</SelectItem>
      <SelectItem value="verified">Verified</SelectItem>
      <SelectItem value="partial">Partially Verified</SelectItem>
      <SelectItem value="none">Not Verified</SelectItem>
    </SelectContent>
  </Select>

  {/* Status Filter */}
  <Select>
    <SelectTrigger
      className="w-full px-2 py-2 text-sm text-[#0A0A0A]
                 border border-gray-300 rounded-lg bg-gray-50
                 focus:outline-none focus:ring-0 focus:ring-offset-0
                 shadow-none"
    >
      <SelectValue placeholder="All Status" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="suspended">Suspended</SelectItem>
    </SelectContent>
  </Select>

  {/* Ratings Filter */}
  <Select>
    <SelectTrigger
      className="w-full px-2 py-2 text-sm text-[#0A0A0A]
                 border border-gray-300 rounded-lg bg-gray-50
                 focus:outline-none focus:ring-0 focus:ring-offset-0
                 shadow-none"
    >
      <SelectValue placeholder="All Ratings" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">All Ratings</SelectItem>
      <SelectItem value="5">5⭐</SelectItem>
      <SelectItem value="4">4⭐</SelectItem>
      <SelectItem value="3">3⭐</SelectItem>
      <SelectItem value="2">2⭐</SelectItem>
      <SelectItem value="1">1⭐</SelectItem>
    </SelectContent>
  </Select>

</div>

                </div>
            </header>

            <CustomTable columns={userColumns} data={PartnerData} />
            <CustomPagination
                totalItems={PartnerData.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default UserTable;
