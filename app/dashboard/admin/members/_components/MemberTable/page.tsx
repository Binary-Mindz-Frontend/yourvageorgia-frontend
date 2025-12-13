"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, Ban, CircleCheck, Eye, Pen } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import toast from "react-hot-toast";
import { getAllUsers, IFilters, IUserResponse } from "@/services/users/users";
import FilterSection from "../MemberFilter/MemberFilter"; // Correct path for the filter section
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import UserDetailModal from "../userModal/userModal";
import UserUpdateModal from "../userModal/UserUpdateModal";

const MemberPage = () => {
    const pageSize = 10;
    const [isBlockDialogOpen, setBlockDialogOpen] = useState(false);
    const [, setSelectedUser] = useState<IUserResponse["data"] | null>(null);
    // NEW STATE for Modal
    const [isUserDetailModalOpen, setUserDetailModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    // NEW UPDATE MODAL STATE
    const [isUserUpdateModalOpen, setUserUpdateModalOpen] = useState(false);
    const [selectedUpdateUserId, setSelectedUpdateUserId] = useState<string | null>(null);
    // State for storing fetched users and the filters
    const [users, setUsers] = useState<IUserResponse["data"][]>([]);
    const [totalItems, setTotalItems] = useState(0);
    // 1. REMOVE currentPage state. Use filters.page instead.
    const [filters, setFilters] = useState<IFilters>({
        search: "",
        role: "",
        isMembership: "",
        isBlocked: "",
        limit: pageSize,
        page: 1,
    });

    // Function to re-fetch users based on current filters (useful for updates)
    const fetchUsers = useCallback(async (currentFilters: IFilters) => {
        const response = await getAllUsers(currentFilters);
        if ("data" in response && "meta" in response) {
            setUsers(response.data);
            setTotalItems(response.meta.total);
        } else if ("error" in response) {
            toast.error(response.error);
        }
    }, []);

    useEffect(() => {
        fetchUsers(filters);
    }, [filters, fetchUsers]); // Dependency on fetchUsers and filters

    const tableData = users;

    const handleBlockClick = (user: IUserResponse["data"]) => {
        setSelectedUser(user);
        setBlockDialogOpen(true);
    };
    const handleViewClick = (userId: string) => {
        setSelectedUserId(userId);
        setUserDetailModalOpen(true);
    };

    const handleCloseModal = () => {
        setUserDetailModalOpen(false);
        setSelectedUserId(null); // Clear selected user ID on close
    };

    // NEW HANDLER FOR UPDATE MODAL
    const handleUpdateClick = (userId: string) => {
        setSelectedUpdateUserId(userId);
        setUserUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setUserUpdateModalOpen(false);
        setSelectedUpdateUserId(null);
    };

    // HANDLER TO REFRESH DATA AFTER A SUCCESSFUL UPDATE
    const handleUpdateSuccess = () => {
        // Re-fetch the current page to see the updated user data
        fetchUsers(filters);
    };
    // console.log("Users data:", users);

    const columns: Column<typeof users[0]>[] = [
        {
            header: "Name",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span className="text-white">{`${row.firstName} ${row.lastName}`}</span>
                </div>
            ),
        },
        {
            header: "Email",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span className="text-white">{row.email}</span>
                </div>
            ),
        },
        {
            header: "Role",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span className="text-white">{row.role === "user" ? "User" : "Admin"}</span>
                </div>
            ),
        },
        {
            header: "Status",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${row.isBlocked
                            ? "bg-red-100 text-red-800"
                            : row.isMembership
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                        {row.isBlocked ? "Blocked" : row.isMembership ? "Member" : "Inactive"}
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
                                onClick={() => handleViewClick(row._id)} // Pass the user's ID
                            >
                                <Eye size={16} className="text-blue-500" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => handleUpdateClick(row._id)} // <-- NEW HANDLER
                            >
                                <Pen size={16} className="text-orange-500" />
                                Update
                            </DropdownMenuItem>
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

    // Handle changes to filters (called from FilterSection)
    const handleFilterChange = useCallback(
        (newFilters: Partial<IFilters>) => { // Use Partial<IFilters> as you don't pass all fields
            setFilters((prev) => ({
                ...prev,
                ...newFilters,
                page: 1, // Reset to first page when filters change
            }));
        },
        []
    );


    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage, // Update page number in filters
        }));
    };


    return (
        <div>
            <header className="flex justify-between items-center mb-4 flex-wrap gap-5">
                <h1 className="text-base py-2 sm:py-5 text-white">User Management</h1>
                <FilterSection onFilterChange={handleFilterChange} />
            </header>

            <CustomTable columns={columns} data={tableData} loading={false} />

            <CustomPagination
                totalItems={totalItems} // <-- FIX: Use the total count from the API
                pageSize={pageSize}
                currentPage={filters.page}
                onPageChange={handlePageChange}
            />
            {/* User Details Modal (Add this at the end of the component return) */}
            <UserDetailModal
                userId={selectedUserId}
                isOpen={isUserDetailModalOpen}
                onClose={handleCloseModal}
            />
            <UserUpdateModal
                userId={selectedUpdateUserId}
                isOpen={isUserUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                onUpdateSuccess={handleUpdateSuccess} // Pass the refresh function
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
                                // Add logic to block the user here
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
