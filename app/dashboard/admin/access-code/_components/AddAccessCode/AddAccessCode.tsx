"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    createAccessCode,
    IAccessCode,
    updateAccessCode,
} from "@/services/access-code/access-code";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AddAccessCodeProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEdit?: boolean;
    initialData?: IAccessCode;
    onSuccess?: () => void;
};

export default function AddAccessCodeModal({
    open,
    onOpenChange,
    isEdit = false,
    initialData,
    onSuccess,
}: AddAccessCodeProps) {
    const [code, setCode] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [maxUses, setMaxUses] = useState<number | string>("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (isEdit && initialData) {
            setCode(initialData.code);
            // Format date for datetime-local input
            const date = new Date(initialData.expiresAt);
            const formattedDate = date.toISOString().slice(0, 16);
            setExpiresAt(formattedDate);
            setMaxUses(initialData.maxUses ?? "");
            setIsActive(initialData.isActive);
        } else {
            setCode("");
            setExpiresAt("");
            setMaxUses("");
            setIsActive(true);
        }
    }, [isEdit, initialData, open]);

    const handleSubmit = async () => {
        const normalizedCode = code.replace(/\s+/g, "");

        // Validation for create
        if (!isEdit && (!normalizedCode || !expiresAt)) {
            toast.error("Code and Expiry Date are required");
            return;
        }

        setLoading(true);
        try {
            let res;
            if (isEdit && initialData) {
                // Edit body: { maxUses?, isActive? }
                res = await updateAccessCode(initialData._id, {
                    maxUses: maxUses === "" ? undefined : Number(maxUses),
                    isActive,
                });
            } else {
                // Create body: { code, expiresAt, maxUses? }
                res = await createAccessCode({
                    code: normalizedCode,
                    expiresAt: new Date(expiresAt).toISOString(),
                    maxUses: maxUses === "" ? undefined : Number(maxUses),
                });
            }

            if ("error" in res) {
                toast.error(res.error);
            } else {
                toast.success(`Access code ${isEdit ? "updated" : "created"} successfully`);
                if (onSuccess) onSuccess();
                onOpenChange(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg p-6 rounded-2xl [&>button]:hidden bg-[#1a1a1a] text-white border-gray-800">
                <DialogHeader>
                    <div className="flex items-center justify-between w-full">
                        <DialogTitle className="text-lg font-semibold text-white">
                            {isEdit ? "Edit Access Code" : "Create New Access Code"}
                        </DialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 rounded hover:bg-gray-800 transition-colors"
                        >
                            <X className="h-5 w-5 text-white cursor-pointer" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Code - Only editable on Create */}
                    <div className="space-y-1">
                        <Label className="text-sm text-gray-400">Access Code</Label>
                        <Input
                            placeholder="e.g. SUMMER2024"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="h-12 bg-black border-gray-800 text-white focus:border-primary/50"
                            disabled={loading || isEdit}
                        />
                    </div>

                    {/* Expiry Date - Only editable on Create */}
                    <div className="space-y-1">
                        <Label className="text-sm text-gray-400">Expiry Date & Time</Label>
                        <div className="relative">
                            <Input
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                className="h-12 bg-black border-gray-800 text-white focus:border-primary/50 block w-full pr-10"
                                disabled={loading || isEdit}
                            />
                        </div>
                    </div>

                    {/* Max Uses */}
                    <div className="space-y-1">
                        <Label className="text-sm text-gray-400">Max Uses (Optional)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 100"
                            value={maxUses}
                            onChange={(e) => setMaxUses(e.target.value)}
                            className="h-12 bg-black border-gray-800 text-white focus:border-primary/50"
                            disabled={loading}
                        />
                    </div>

                    {/* Is Active - Only for Edit */}
                    {isEdit && (
                        <div className="flex items-center justify-between p-3 bg-black rounded-lg border border-gray-800">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Status</Label>
                                <p className="text-xs text-gray-500">
                                    Enable or disable this access code
                                </p>
                            </div>
                            <Switch
                                checked={isActive}
                                onCheckedChange={setIsActive}
                                className="data-[state=checked]:bg-green-600"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-8 gap-3 sm:gap-4">
                    <Button
                        variant="outline"
                        className="px-6 border-gray-800 text-white hover:bg-gray-800"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant={"outline"}
                        className="px-6 border-gray-800 text-white hover:bg-gray-800"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <span>{isEdit ? "Updating..." : "Creating..."}</span>
                        ) : isEdit ? (
                            "Update Changes"
                        ) : (
                            "Create Code"
                        )}

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
