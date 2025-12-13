// app/dashboard/admin/members/_components/UserUpdateModal.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// NOTE: Make sure the IUserUpdatePayload in this import allows string | null
import { getUserById, IUserResponse, IUserUpdatePayload, updateUserById } from "@/services/users/users";
import toast from "react-hot-toast";

// Helper type for the user data structure
type UserDetail = IUserResponse["data"];

interface UserUpdateModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
    // Callback to refresh the parent table after update
    onUpdateSuccess: () => void; 
}

// Helper component for form row (defined outside)
const FormRow: React.FC<{ label: string, name: keyof UserDetail, children: React.ReactNode }> = ({ label, name, children }) => (
    <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={name as string} className="text-right text-white">
            {label}
        </Label>
        <div className="col-span-3">
            {children}
        </div>
    </div>
);

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({ userId, isOpen, onClose, onUpdateSuccess }) => {
    const [formData, setFormData] = useState<Partial<UserDetail>>({});
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // REMOVED fetchUser useCallback definition.

    // FIX 1: Move data fetching logic inline to resolve "cascading renders" warning.
    useEffect(() => {
        let ignore = false; // Cleanup flag for async calls

        async function fetchUserData(id: string) {
            setLoading(true);
            const result = await getUserById(id);

            if (!ignore) {
                if ("error" in result) {
                    toast.error(result.error);
                    setFormData({});
                } else {
                    // Populate form data with fetched user details
                    setFormData(result);
                }
                setLoading(false);
            }
        }

        // Run fetch when modal opens and userId is available
        if (isOpen && userId) {
            fetchUserData(userId);
        }
        
        // Cleanup function
        return () => {
            ignore = true;
        };
    }, [isOpen, userId]); // Dependencies only include props/state, not fetchUser

    const handleDialogClose = useCallback((open: boolean) => {
        if (!open) {
            setFormData({}); // Clear form data on close
            onClose(); // Close the modal
        }
    }, [onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof UserDetail, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!userId) return;

        // Extract and shape the payload for the PATCH request
        // FIX 2: TypeScript Error handled by allowing null values to be passed to the service payload.
        const payload: IUserUpdatePayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            // phone and dateOfBirth now correctly map to the updated IUserUpdatePayload interface
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth, 
            role: formData.role as 'user' | 'admin',
        };

        setIsUpdating(true);
        const result = await updateUserById(userId, payload);
        setIsUpdating(false);

        if ("error" in result) {
            toast.error(result.error);
        } else {
            toast.success("User updated successfully!");
            onUpdateSuccess(); // Refresh the parent table
            handleDialogClose(false); // Close the modal
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-lg">
                <DialogHeader className="border-b border-gray-700 pb-3">
                    <DialogTitle className="text-xl font-bold">Update User</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Edit user details for {formData.firstName} {formData.lastName}.
                    </DialogDescription>
                </DialogHeader>
                
                {loading && <p className="text-center py-8 text-gray-400">Loading user data...</p>}

                {formData.email && !loading && (
                    <div className="grid gap-6 py-4">
                        <FormRow label="First Name" name="firstName">
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName || ''}
                                onChange={handleInputChange}
                                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                            />
                        </FormRow>
                        
                        <FormRow label="Last Name" name="lastName">
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName || ''}
                                onChange={handleInputChange}
                                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                            />
                        </FormRow>

                        <FormRow label="Email" name="email">
                            <Input
                                id="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                                type="email"
                            />
                        </FormRow>

                        <FormRow label="Phone" name="phone">
                            <Input
                                id="phone"
                                name="phone"
                                // Ensure input handles potential null by coercing to empty string
                                value={formData.phone || ''} 
                                onChange={handleInputChange}
                                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                                type="tel"
                            />
                        </FormRow>

                        <FormRow label="Role" name="role">
                            <Select
                                value={formData.role || ''}
                                onValueChange={(value) => handleSelectChange('role', value)}
                            >
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormRow>
                        
                        {/* You can add Date of Birth input here, using value={formData.dateOfBirth || ''} */}
                    </div>
                )}
                
                <DialogFooter className="bg-gray-900 pt-4">
                    <Button 
                        type="button" 
                        onClick={handleUpdate} 
                        disabled={loading || isUpdating || !userId}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isUpdating ? 'Updating...' : 'Update User'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserUpdateModal;