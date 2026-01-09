"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/services/auth";
import { useState } from "react";
import { toast } from "sonner";


const ChangePasswordForm = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setIsLoading(true);
        toast.loading("Updating password...", { id: "change-password" });

        try {
            const res = await changePassword({
                password: newPassword,
            });

            if (res?.success) {
                toast.success("Password updated successfully!", { id: "change-password" });
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(res?.message || "Failed to update password", { id: "change-password" });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.", { id: "change-password" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Input
                    type="password"
                    placeholder="New password*"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="text-white border-neutral-700 rounded-full px-6 bg-transparent"
                />
            </div>

            <div className="space-y-2">
                <Input
                    type="password"
                    placeholder="Confirm new password*"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="text-white border-neutral-700 rounded-full px-6 bg-transparent"
                />
            </div>

            <div className="pt-4 flex justify-center">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-black cursor-pointer text-white border border-white px-10 py-3.5 rounded-full hover:bg-white hover:text-black transition"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating...
                        </div>
                    ) : (
                        "Update Password"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
