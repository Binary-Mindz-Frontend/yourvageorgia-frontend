// app/dashboard/admin/members/_components/userModal/userModal.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getUserById, IUserResponse } from "@/services/users/users";
import toast from "react-hot-toast";

type UserDetail = IUserResponse["data"];

interface UserDetailModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

// =======================================================
// Helper components and functions (defined outside)
// =======================================================

const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

const DetailRow: React.FC<{ label: string, value: string | boolean | null }> = ({ label, value }) => {
    const displayValue = typeof value === 'boolean' ? formatBoolean(value) : (value || 'N/A');
    return (
        <div className="flex justify-between py-2 border-b border-gray-700 last:border-b-0">
            <span className="font-semibold text-white">{label}:</span>
            <span className="text-white font-medium">{displayValue}</span>
        </div>
    );
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, isOpen, onClose }) => {
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(false);

    // REMOVED fetchUser useCallback definition.

    // FIX 1: Fetch data logic is now defined directly inside useEffect.
    useEffect(() => {
        let ignore = false; // Cleanup flag for async calls

        async function fetchUserData(id: string) {
            setLoading(true);
            const result = await getUserById(id);

            if (!ignore) {
                if ("error" in result) {
                    toast.error(result.error);
                    setUser(null);
                } else {
                    setUser(result);
                }
                setLoading(false);
            }
        }

        if (isOpen && userId) {
            fetchUserData(userId);
        }

        // Cleanup function for asynchronous effects
        return () => {
            ignore = true;
        };
    }, [isOpen, userId]); // Dependencies only include props/state, not fetchUser

    // FIX 2: Handle synchronous state clear for modal closing.
    const handleDialogClose = useCallback((open: boolean) => {
        if (!open) {
            // Clear the local state (user data) immediately when the dialog starts to close.
            setUser(null); 
            // Then call the parent's handler to close the modal (set isOpen: false).
            onClose(); 
        }
    }, [onClose]);


    return (
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="bg-[#1a1a1a] border-gray-700 text-white sm:max-w-md md:max-w-lg">
                <DialogHeader className="border-b border-gray-700 pb-3">
                    <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Detailed profile information for the selected user.
                    </DialogDescription>
                </DialogHeader>
                
                {loading && <p className="text-center py-8 text-gray-400">Loading user data...</p>}

                {user && !loading && (
                    <div className="grid gap-4 pt-4 text-sm">
                        <DetailRow label="Name" value={`${user.firstName} ${user.lastName}`} />
                        <DetailRow label="Email" value={user.email} />
                        <DetailRow label="Role" value={user.role} />
                        <DetailRow label="Phone" value={user.phone} />
                        <DetailRow label="Date of Birth" value={user.dateOfBirth} />
                        
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <DetailRow label="Membership" value={user.isMembership} />
                            <DetailRow label="Partner" value={user.isPartner} />
                            <DetailRow label="Blocked" value={user.isBlocked} />
                            <DetailRow label="Verified" value={user.isVerified} />
                            {user.createdAt && <DetailRow label="Created At" value={new Date(user.createdAt).toLocaleDateString()} />}
                        </div>
                    </div>
                )}
                
                {!user && !loading && userId && (
                    <p className="text-center py-8 text-red-400">Failed to load user details.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailModal;