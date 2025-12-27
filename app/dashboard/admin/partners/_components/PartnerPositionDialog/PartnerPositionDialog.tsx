"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Partner } from "@/types/partner.types";
import {
    updatePartnerPosition,
    IPositionUpdateData,
} from "@/services/partner/partner";

// --- Type Definition ---
// Pass the full Partner data to the dialog so it can read the current position
interface PartnerPositionDialogProps {
    partner: Partner & { _id: string } | null; // The partner data to update
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateSuccess: () => void; // Callback to refresh data in the parent
}

const toastStyle = { background: "#000", color: "#fff", marginTop: "4rem" };

const PartnerPositionDialog: React.FC<PartnerPositionDialogProps> = ({
    partner,
    open,
    onOpenChange,
    onUpdateSuccess,
}) => {
    const [newPosition, setNewPosition] = useState("");
    const [loading, setLoading] = useState(false);

    // Set default position when the dialog opens or partner changes
    useEffect(() => {
        if (partner && open) {
            // Ensure position is treated as a string for the input value
            setNewPosition(String(partner.position ?? "")); 
        } else {
            setNewPosition(""); // Clear state when dialog is closed
        }
    }, [partner, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!partner?._id) {
            toast.error("Partner ID is missing.", { style: toastStyle });
            return;
        }

        const positionValue = parseInt(newPosition, 10);

        if (isNaN(positionValue) || positionValue < 0) {
            toast.error("Please enter a valid position number.", { style: toastStyle });
            return;
        }

        setLoading(true);

        const data: IPositionUpdateData = {
            position: positionValue,
        };

        try {
            const res = await updatePartnerPosition(partner._id, data);

            if ("error" in res) {
                toast.error(res.error, { style: toastStyle });
            } else {
                toast.success("Partner position updated successfully!", { style: toastStyle });
                onUpdateSuccess(); // Call the parent's success handler to refresh table/counts
                onOpenChange(false); // Close the dialog
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.", { style: toastStyle });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25 bg-[#1a1a1a] border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Update Partner Position</DialogTitle>
                    <DialogDescription className="text-white">
                        Set a new position number for <span className="font-bold">{partner?.name || "the partner"}.</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="position" className="text-right">
                            New Position
                        </Label>
                        <Input
                            id="position"
                            type="number"
                            value={newPosition}
                            onChange={(e) => setNewPosition(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <Button className="cursor-pointer" type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PartnerPositionDialog;