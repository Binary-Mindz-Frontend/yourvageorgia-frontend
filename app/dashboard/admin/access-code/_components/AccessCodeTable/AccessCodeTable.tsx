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
import { Input } from "@/components/ui/input";
import { deleteAccessCode, getAccessCodes, IAccessCode } from "@/services/access-code/access-code";
import {
    MoreHorizontal,
    Plus,
    Search,
    SquarePen,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import AccessCodeOverviewSection from "../AccessCodeOverviewSection/AccessCodeOverviewSection";
import AddAccessCodeModal from "../AddAccessCode/AddAccessCode";

const AccessCodeTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [totalCodes, setTotalCodes] = useState(0);

    const [accessCodes, setAccessCodes] = useState<IAccessCode[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCode, setSelectedCode] = useState<IAccessCode | null>(null);

    const toastStyle = { background: "#000", color: "#fff", marginTop: "4rem" };

    const fetchAccessCodes = async () => {
        setLoading(true);
        try {
            const res = await getAccessCodes(currentPage, pageSize, search);
            if ("error" in res) {
                toast.error(res.error, { style: toastStyle });
            } else {
                setAccessCodes(res.data);
                setTotalCodes(res.meta.total);
            }
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to fetch access codes", { style: toastStyle });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccessCodes();
    }, [currentPage, pageSize, search]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this access code?")) return;

        setDeleting(id);
        try {
            const res = await deleteAccessCode(id);
            if ("error" in res) {
                toast.error(res.error, { style: toastStyle });
            } else {
                toast.success(res.message, { style: toastStyle });
                setAccessCodes(prev => prev.filter(item => item._id !== id));
                setTotalCodes(prev => prev - 1);
            }
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to delete access code", { style: toastStyle });
        } finally {
            setDeleting(null);
        }
    };

    const columns: Column<IAccessCode>[] = [
        {
            header: "Code",
            accessor: "code",
            cell: (row) => <span className="text-white font-mono">{row.code}</span>,
        },
        {
            header: "Max Uses",
            accessor: "maxUses",
            cell: (row) => <span className="text-white">{row.maxUses ?? "Unlimited"}</span>,
        },
        {
            header: "Current Uses",
            accessor: "currentUses",
            cell: (row) => <span className="text-white">{row.currentUses}</span>,
        },
        {
            header: "Status",
            accessor: "isActive",
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? "bg-green-600/20 text-green-500" : "bg-red-600/20 text-red-500"}`}>
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            header: "Expires At",
            accessor: "expiresAt",
            cell: (row) => <span className="text-white">{new Date(row.expiresAt).toLocaleDateString()}</span>,
        },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex justify-center items-center w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-gray-800 rounded-md">
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40 bg-[#1a1a1a] border-gray-800 text-white">
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                                onClick={() => {
                                    setSelectedCode(row);
                                    setOpenEdit(true);
                                }}
                            >
                                <SquarePen size={16} />
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-gray-800"
                                onClick={() => handleDelete(row._id)}
                                disabled={deleting === row._id}
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
            <AccessCodeOverviewSection totalCodes={totalCodes} loading={loading} />

            <header>
                <h1 className="text-base py-2 sm:py-5 text-white">Access Code Management</h1>

                <div className="flex justify-between mb-4 items-center w-full flex-wrap gap-5">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-[#1a1a1a] border-gray-800 text-white focus:ring-0 focus:border-primary/50"
                        />
                    </div>

                    <Button
                        className="cursor-pointer flex items-center bg-[#1a1a1a] hover:bg-gray-800 px-4 py-2"
                        onClick={() => setOpenAdd(true)}
                    >
                        <Plus size={18} className="mr-2 text-white" />
                        <span className="text-white text-base">Create Access Code</span>
                    </Button>
                </div>

                <p className="text-base py-1 text-gray-400">Access Code Details</p>
            </header>

            <CustomTable columns={columns} data={accessCodes} loading={loading} />

            <CustomPagination
                totalItems={totalCodes}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <AddAccessCodeModal
                open={openAdd}
                onOpenChange={setOpenAdd}
                onSuccess={fetchAccessCodes}
            />

            <AddAccessCodeModal
                open={openEdit}
                onOpenChange={(open) => {
                    setOpenEdit(open);
                    if (!open) setSelectedCode(null);
                }}
                isEdit={true}
                initialData={selectedCode || undefined}
                onSuccess={fetchAccessCodes}
            />
        </div>
    );
};

export default AccessCodeTable;
