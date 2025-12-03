"use client";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X,  House, TreePine, Brush, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AddCategoryProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEdit?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
};

export default function AddCategoryModal({
    open,
    onOpenChange,
    isEdit = false,
    initialData,
}: AddCategoryProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent
                className="sm:max-w-lg p-6 rounded-2xl [&>button]:hidden"

            >
                {/* ---- Header ---- */}
                <DialogHeader>
                    <div className="flex items-center justify-between w-full">
                        <DialogTitle className="text-sm font-semibold ">
                            {isEdit ? "Edit Category" : "Add New Category"}
                        </DialogTitle>

                        {/* Custom Close Button */}
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 rounded hover:bg-muted"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </DialogHeader>

                {/* ---- Body Form ---- */}
                <div className="space-y-4 mt-2">
                    {/* Category Name */}
                    <div className="space-y-1">
                        <Label className="text-[18px] text-[#2D2D2D]">Category Name</Label>
                        <Input
                            placeholder="Enter category name"
                            defaultValue={initialData?.name}
                            className="h-12 bg-[#F3F3F5]"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1">
                        <Label className="text-[18px] text-[#2D2D2D]">Slug</Label>
                        <Input
                            placeholder="category-slug"
                            defaultValue={initialData?.slug}
                            className="h-12 bg-[#F3F3F5]"
                        />
                    </div>

                    {/* Parent Category */}
                    <div className="space-y-1">
                        <Label className="text-[18px] text-[#2D2D2D]">Parent Category</Label>

                        <Select defaultValue={initialData?.parent || undefined}>
                            <SelectTrigger className="h-14 bg-[#F3F3F5] w-full">
                                <SelectValue placeholder="None (Top Level)" />
                            </SelectTrigger>

                            <SelectContent className="w-full">

                                <SelectItem
                                    value="home-improvement"
                                    className="flex items-center gap-1"
                                >
                                    <House />
                                    Home Improvement
                                </SelectItem>

                                <SelectItem value="landscaping" className="flex items-center gap-1"> <TreePine />Landscaping</SelectItem>
                                <SelectItem value="cleaning" className="flex items-center gap-1"><Brush /> Cleaning</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    {/* Feature Image */}
                    {/* Feature Image */}
                    <div className="space-y-1">
                        <Label className="text-[18px] text-[#2D2D2D]">Feature Image</Label>

                        {/* Wrapper for clickable area */}
                        <label
                            htmlFor="featureImage"
                            className="border rounded-md p-6 text-center bg-gray-50 cursor-pointer block"
                        >
                            <Upload className="mx-auto mb-2 text-[#99A1AF]" />

                            <p className="text-sm text-[#4A5565]">Click to upload or drag and drop</p>
                            <p className="text-xs text-[#6A7282]">PNG, JPG up to 10MB</p>

                            {/* Hidden input */}
                            <input
                                id="featureImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        console.log("Selected file:", file);
                                    }
                                }}
                            />
                        </label>
                    </div>

                </div>

                {/* ---- Footer ---- */}
                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        className="px-6"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button className="px-6 bg-black text-white hover:bg-black/90">
                        {isEdit ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
