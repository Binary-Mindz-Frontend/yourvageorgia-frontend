"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, Ban, CircleCheck, Eye, Trash2, CirclePlus, CircleMinus, Verified, ShieldBan } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import CustomTable, { Column } from "@/components/Shared/dashboard/customtable/CustomTable";
import CustomPagination from "@/components/Shared/dashboard/custompagination/CustomPagination";
import toast from "react-hot-toast";
import { getAllUsers, IFilters, IUserResponse, updateUserById } from "@/services/users/users";
import FilterSection from "../MemberFilter/MemberFilter";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import UserDetailModal from "../userModal/userModal";

// Define all possible action types in one place for better management
type ActionType = 'block' | 'unblock' | 'delete' | 'restore' | 'addPartner' | 'removePartner' | 'verify' | 'unverify';

const MemberPage = () => {
    const pageSize = 10;

    // FIX 1: Update actionType state definition to include 'restore'
    const [isActionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<ActionType | null>(null);
    const [selectedUser, setSelectedUser] = useState<IUserResponse["data"] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // NEW STATE for Modal
    const [isUserDetailModalOpen, setUserDetailModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // State for storing fetched users and the filters
    const [users, setUsers] = useState<IUserResponse["data"][]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState<IFilters>({
        search: "",
        role: "",
        isMembership: "",
        isBlocked: "",
        limit: pageSize,
        page: 1,
    });

    // PROPER FIX: Move the fetch logic inside useEffect
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await getAllUsers(filters);
            if ("data" in response && "meta" in response) {
                setUsers(response.data);
                setTotalItems(response.meta.total);
            } else if ("error" in response) {
                toast.error(response.error);
            }
        };

        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search, filters.role, filters.isMembership, filters.isBlocked, filters.page, filters.limit]);

    const tableData = users;

    // Separate function for manual refresh (used in handleUpdateSuccess)
    const refetchUsers = async () => {
        const response = await getAllUsers(filters);
        if ("data" in response && "meta" in response) {
            setUsers(response.data);
            setTotalItems(response.meta.total);
        } else if ("error" in response) {
            toast.error(response.error);
        }
    };

    // Handle action clicks (Block, Unblock, Delete, Partner, Verified)
    const handleActionClick = (user: IUserResponse["data"], action: ActionType) => {
        setSelectedUser(user);
        setActionType(action);
        setActionDialogOpen(true);
    };

    // Execute the action (Block, Unblock, Delete, Restore, Partner, or Verified)
    const executeAction = async () => {
        if (!selectedUser || !actionType) return;

        setIsProcessing(true);

        let payload = {};

        // Block/Unblock/Delete/Restore logic
        if (actionType === 'block') {
            payload = { isBlocked: true };
        } else if (actionType === 'unblock') {
            payload = { isBlocked: false };
        } else if (actionType === 'delete') {
            payload = { isDeleted: true };
        } else if (actionType === 'restore') {
            payload = { isDeleted: false };
            // Partner logic
        } else if (actionType === 'addPartner') {
            payload = { isPartner: true };
        } else if (actionType === 'removePartner') {
            payload = { isPartner: false };
            // Verified logic
        } else if (actionType === 'verify') {
            payload = { isVerified: true };
        } else if (actionType === 'unverify') {
            payload = { isVerified: false };
        } else {
            // Should not happen if actionType is strictly one of the allowed values
            setIsProcessing(false);
            return;
        }

        const result = await updateUserById(selectedUser._id, payload);
        setIsProcessing(false);

        if ("error" in result) {
            toast.error(result.error);
        } else {
            // Note: actionType is safe to use as index here because we check it above
            const actionMessages: Record<ActionType, string> = {
                block: "User blocked successfully!",
                unblock: "User unblocked successfully!",
                delete: "User deleted successfully!",
                restore: "User restored successfully!", // Added restore message
                addPartner: "User added as partner successfully!",
                removePartner: "User removed as partner successfully!",
                verify: "User verified successfully!",
                unverify: "User unverified successfully!",
            };
            toast.success(actionMessages[actionType]);
            setActionDialogOpen(false);
            refetchUsers(); // Refresh the table
        }
    };

    const handleViewClick = (userId: string) => {
        setSelectedUserId(userId);
        setUserDetailModalOpen(true);
    };

    const handleCloseModal = () => {
        setUserDetailModalOpen(false);
        setSelectedUserId(null);
    };



    const columns: Column<typeof users[0]>[] = [
        {
            header: "ID",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span className="text-white">{row.membershipId ?? "N/A"}</span>
                </div>
            ),
        },
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
            header: "Expired Membership",
            cell: (row) => {
                if (!row.membershipExpiry) {
                    return (
                        <div className="flex justify-center items-center w-full">
                            <span className="text-white">N/A</span>
                        </div>
                    );
                }

                // Convert Unix timestamp (seconds) to milliseconds
                const date = new Date(row.membershipExpiry * 1000);
                const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY

                return (
                    <div className="flex justify-center items-center w-full">
                        <span className="text-white">{formattedDate}</span>
                    </div>
                );
            },
        },
        {
            header: "Verified",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${row.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {row.isVerified ? "Verified" : "Not Verified"}
                    </span>
                </div>
            ),
        },
        {
            header: "Membership",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${row.isMembership
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                        {row.isMembership ? "Member" : "Inactive"}
                    </span>
                </div>
            ),
        },
        {
            header: "Partner",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${row.isPartner
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {row.isPartner ? "Partner" : "Not Partner"}
                    </span>
                </div>
            ),
        },
        {
            header: "Blocked",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${row.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                            }`}
                    >
                        {row.isBlocked ? "Blocked" : "Active"}
                    </span>
                </div>
            ),
        },
        {
            header: "Deleted",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${row.isDeleted
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                            }`}
                    >
                        {row.isDeleted ? "Deleted" : "Active"}
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
                                onClick={() => handleViewClick(row._id)}
                            >
                                <Eye size={16} className="text-blue-500" />
                                View Details
                            </DropdownMenuItem>


                            {/* Show Block or Unblock based on current status */}
                            {!row.isBlocked ? (
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleActionClick(row, 'block')}
                                >
                                    <Ban size={16} className="text-red-600" />
                                    Block
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleActionClick(row, 'unblock')}
                                >
                                    <CircleCheck size={16} className="text-green-500" />
                                    Unblock
                                </DropdownMenuItem>
                            )}

                            {/* Show partner status: Add Partner if !isPartner, Remove Partner if isPartner */}
                            {!row.isPartner ? (
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleActionClick(row, 'addPartner')}
                                >
                                    <CirclePlus size={16} className="text-green-500" />
                                    Add Partner
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleActionClick(row, 'removePartner')}
                                >
                                    <CircleMinus size={16} className="text-red-600" />
                                    Remove Partner
                                </DropdownMenuItem>
                            )}

                            {/* Show verified status: Verify if !isVerified, Unverify if isVerified */}
                            {/* NOTE: I've corrected the check to use row.isVerified */}
                            {!row.isVerified ? (
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleActionClick(row, 'verify')} // Corrected action type
                                >
                                    <Verified size={16} className="text-green-500" />
                                    Verify
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleActionClick(row, 'unverify')} // Corrected action type
                                >
                                    <ShieldBan size={16} className="text-red-600" />
                                    Unverify
                                </DropdownMenuItem>
                            )}

                            {!row.isDeleted ? (
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleActionClick(row, 'delete')}
                                >
                                    <Trash2 size={16} className="text-red-600" />
                                    Delete
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleActionClick(row, 'restore')} // New Restore Action
                                >
                                    <CircleCheck size={16} className="text-green-500" />
                                    Restore
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    // Handle changes to filters (called from FilterSection)
    const handleFilterChange = useCallback(
        (newFilters: Partial<IFilters>) => {
            setFilters((prev) => ({
                ...prev,
                ...newFilters,
                page: 1,
            }));
        },
        []
    );

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    // Get dialog content based on action type
    // Updated to include partner/verify dialog content
    const getDialogContent = () => {
        // It's safe to use ActionType as key here because actionType is of type ActionType | null
        if (!actionType) return { title: "", description: "", buttonText: "", buttonClass: "" };

        const content: Record<ActionType, { title: string, description: string, buttonText: string, buttonClass: string }> = {
            block: {
                title: "Block User",
                description: `Are you sure you want to block ${selectedUser?.firstName} ${selectedUser?.lastName}? This will restrict their access to the platform.`,
                buttonText: "Block User",
                buttonClass: "bg-red-600 rounded-md hover:bg-red-700"
            },
            unblock: {
                title: "Unblock User",
                description: `Are you sure you want to unblock ${selectedUser?.firstName} ${selectedUser?.lastName}? This will restore their access to the platform.`,
                buttonText: "Unblock User",
                buttonClass: "bg-green-600 rounded-md hover:bg-green-700"
            },
            delete: {
                title: "Delete User",
                description: `Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action will mark the user as deleted.`,
                buttonText: "Delete User",
                buttonClass: "bg-red-600 rounded-md hover:bg-red-700"
            },
            restore: { // Added restore content
                title: "Restore User",
                description: `Are you sure you want to restore ${selectedUser?.firstName} ${selectedUser?.lastName}? This action will return the user to active status.`,
                buttonText: "Restore User",
                buttonClass: "bg-green-600 rounded-md hover:bg-green-700"
            },
            addPartner: {
                title: "Add Partner Status",
                description: `Are you sure you want to grant partner status to ${selectedUser?.firstName} ${selectedUser?.lastName}?`,
                buttonText: "Add Partner",
                buttonClass: "bg-purple-600 rounded-md hover:bg-purple-700"
            },
            removePartner: {
                title: "Remove Partner Status",
                description: `Are you sure you want to revoke partner status from ${selectedUser?.firstName} ${selectedUser?.lastName}?`,
                buttonText: "Remove Partner",
                buttonClass: "bg-red-600 rounded-md hover:bg-red-700"
            },
            verify: {
                title: "Verify User",
                description: `Are you sure you want to verify ${selectedUser?.firstName} ${selectedUser?.lastName}?`,
                buttonText: "Verify User",
                buttonClass: "bg-green-600 rounded-md hover:bg-green-700"
            },
            unverify: {
                title: "Unverify User",
                description: `Are you sure you want to unverify ${selectedUser?.firstName} ${selectedUser?.lastName}?`,
                buttonText: "Unverify User",
                buttonClass: "bg-red-600 rounded-md hover:bg-red-700"
            }
        };

        return content[actionType];
    };

    const dialogContent = getDialogContent();

    return (
        <div>
            <header className="flex justify-between items-center mb-4 flex-wrap gap-5">
                <h1 className="text-base py-2 sm:py-5 text-white">User Management</h1>
                <FilterSection onFilterChange={handleFilterChange} />
            </header>

            <CustomTable columns={columns} data={tableData} loading={false} />

            <CustomPagination
                totalItems={totalItems}
                pageSize={pageSize}
                currentPage={filters.page}
                onPageChange={handlePageChange}
            />

            {/* User Details Modal */}
            <UserDetailModal
                userId={selectedUserId}
                isOpen={isUserDetailModalOpen}
                onClose={handleCloseModal}
            />


            {/* Action Confirmation Dialog (Block/Unblock/Delete/Partner/Verify) */}
            <AlertDialog open={isActionDialogOpen} onOpenChange={setActionDialogOpen} >
                <AlertDialogContent className="bg-[#1a1a1a]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogContent.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end space-x-2">
                        <AlertDialogCancel
                            onClick={() => setActionDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeAction}
                            disabled={isProcessing}
                            className={dialogContent.buttonClass}
                        >
                            {isProcessing ? "Processing..." : dialogContent.buttonText}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MemberPage;