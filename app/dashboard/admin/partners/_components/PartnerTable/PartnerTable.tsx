"use client";
import { Ban, CircleCheck, CircleX, Eye, Mail, MoreHorizontal, Play, Shield, Star } from "lucide-react";
import React, { useState } from "react";
import { IPartnerData, PartnerData } from "../../data/usersData";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";



const UserTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    const userColumns: Column<IPartnerData>[] = [
        {
            header: "User Info",
            cell: (row) => (
                <div className="flex flex-col items-left">
                    <p className="text-sm text-white">{row.userName}</p>
                    <p className="text-sm text-white">{row.email}</p>
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
                        <span className="text-xs text-white">
                            Jobs: {row.performance.jobsPosted}
                        </span>

                        {row.performance.rating && (
                            <div className="flex items-center">
                                <Star size={12} className="text-yellow-400 fill-current" />
                                <span className="ml-1 text-xs text-white">
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
                        <span className="text-xs text-white">
                            Held: {row.performance.earned}
                        </span>
                        <p className="text-white">
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
                                    className="p-2 rounded-md border"
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
        <div >
            <div className="flex ">

            </div>
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
