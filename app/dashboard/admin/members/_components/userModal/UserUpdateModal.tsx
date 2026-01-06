// app/dashboard/admin/members/_components/UserUpdateModal.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserById, IUserResponse, IUserUpdatePayload, updateUserById } from "@/services/users/users";
import { Award, Calendar, CheckCircle, Mail, Phone, Shield, User, Users } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Helper type for the user data structure
type UserDetail = IUserResponse["data"];

interface UserUpdateModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
    // Callback to refresh the parent table after update
    onUpdateSuccess: () => void;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({ userId, isOpen, onClose, onUpdateSuccess }) => {
    const [formData, setFormData] = useState<Partial<UserDetail>>({});
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Move data fetching logic inline to resolve "cascading renders" warning.
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
    }, [isOpen, userId]); // Dependencies only include props/state

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

    // NEW: Handle boolean select changes
    const handleBooleanSelectChange = (name: keyof UserDetail, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    };

    const handleUpdate = async () => {
        if (!userId) return;

        // Extract and shape the payload for the PATCH request
        const payload: IUserUpdatePayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            role: formData.role as 'user' | 'admin',
            isVerified: formData.isVerified,
            isMembership: formData.isMembership,
            isPartner: formData.isPartner,
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
            <DialogContent className="g-linear-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 text-white sm:max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
                <DialogHeader className="border-b border-gray-700/50 pb-4 space-y-2">
                    <DialogTitle className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Update User Profile
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm">
                        Edit user details for <span className="text-blue-400 font-semibold">{formData.firstName} {formData.lastName}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-1">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-400 animate-pulse">Loading user data...</p>
                        </div>
                    )}

                    {!loading && formData._id && (
                        <div className="space-y-6 py-6 px-2">
                            {/* Personal Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2 border-b border-gray-700 pb-2">
                                    <User size={16} className="text-blue-400" />
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-sm text-gray-300 flex items-center gap-2">
                                            <User size={14} className="text-gray-400" />
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleInputChange}
                                            className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="Enter first name"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-sm text-gray-300 flex items-center gap-2">
                                            <User size={14} className="text-gray-400" />
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleInputChange}
                                            className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="Enter last name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm text-gray-300 flex items-center gap-2">
                                            <Mail size={14} className="text-gray-400" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={handleInputChange}
                                            className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            type="email"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm text-gray-300 flex items-center gap-2">
                                            <Phone size={14} className="text-gray-400" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleInputChange}
                                            className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            type="tel"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="dateOfBirth" className="text-sm text-gray-300 flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            Date of Birth
                                        </Label>
                                        <Input
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth || ''}
                                            onChange={handleInputChange}
                                            className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            type="text"
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Account Settings Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2 border-b border-gray-700 pb-2">
                                    <Shield size={16} className="text-purple-400" />
                                    Account Settings
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Role */}
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm text-gray-300 flex items-center gap-2">
                                            <Shield size={14} className="text-gray-400" />
                                            User Role
                                        </Label>
                                        <Select
                                            value={formData.role || ''}
                                            onValueChange={(value) => handleSelectChange('role', value)}
                                        >
                                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all">
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                <SelectItem value="user" className="hover:bg-gray-700">User</SelectItem>
                                                <SelectItem value="admin" className="hover:bg-gray-700">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Verified Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="isVerified" className="text-sm text-gray-300 flex items-center gap-2">
                                            <CheckCircle size={14} className="text-gray-400" />
                                            Verification Status
                                        </Label>
                                        <Select
                                            value={String(formData.isVerified)}
                                            onValueChange={(value) => handleBooleanSelectChange('isVerified', value)}
                                        >
                                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                <SelectItem value="true" className="hover:bg-gray-700">
                                                    <span className="flex items-center gap-2">
                                                        <CheckCircle size={14} className="text-green-500" />
                                                        Verified
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="false" className="hover:bg-gray-700">Not Verified</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Membership Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="isMembership" className="text-sm text-gray-300 flex items-center gap-2">
                                            <Users size={14} className="text-gray-400" />
                                            Membership Status
                                        </Label>
                                        <Select
                                            value={String(formData.isMembership)}
                                            onValueChange={(value) => handleBooleanSelectChange('isMembership', value)}
                                        >
                                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                <SelectItem value="true" className="hover:bg-gray-700">
                                                    <span className="flex items-center gap-2">
                                                        <Users size={14} className="text-blue-500" />
                                                        Active Member
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="false" className="hover:bg-gray-700">Not a Member</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Partner Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="isPartner" className="text-sm text-gray-300 flex items-center gap-2">
                                            <Award size={14} className="text-gray-400" />
                                            Partner Status
                                        </Label>
                                        <Select
                                            value={String(formData.isPartner)}
                                            onValueChange={(value) => handleBooleanSelectChange('isPartner', value)}
                                        >
                                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                <SelectItem value="true" className="hover:bg-gray-700">
                                                    <span className="flex items-center gap-2">
                                                        <Award size={14} className="text-yellow-500" />
                                                        Partner
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="false" className="hover:bg-gray-700">Not a Partner</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t border-gray-700/50 pt-6 flex justify-center">
                    <Button
                        type="button"
                        onClick={handleUpdate}
                        disabled={loading || isUpdating || !userId}
                        className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isUpdating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <CheckCircle size={18} />
                                Update User
                            </span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserUpdateModal;