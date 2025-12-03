"use client";

import { useState } from "react";
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
import { Upload, X } from "lucide-react";
import { toast } from "sonner"; 
import { createCategory, ICategoryResponse } from "@/services/category/category";
import { ICategory } from "@/types/category.types";

type AddCategoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  initialData?: ICategory;
  onCategoryAdded?: (newCategory: ICategory) => void; // callback to update table
};

export default function AddCategoryModal({
  open,
  onOpenChange,
  isEdit = false,
  initialData,
  onCategoryAdded,
}: AddCategoryProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title || !image) {
      toast.error("Title and Image are required", {
        style: { background: "#000", color: "#fff", marginTop: "4rem" },
      });
      return;
    }

    const data: ICategory = { title, image, description };
    setLoading(true);

    try {
      const res: ICategoryResponse | { error: string } = await createCategory(data);

      if ("error" in res) {
        toast.error(res.error, { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
        setLoading(false);
        return;
      }

      // Update table in parent
      if (onCategoryAdded) {
        onCategoryAdded(res.data);
      }

      // Success toast
      toast.success(`${res.data.title} added successfully!`, {
        style: { background: "#000", color: "#fff", marginTop: "4rem" },
      });

      // Close modal
      onOpenChange(false);

      // Reset form
      setTitle("");
      setImage("");
      setDescription("");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Something went wrong", { style: { background: "#000", color: "#fff", marginTop: "4rem" } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 rounded-2xl [&>button]:hidden bg-black text-white">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-sm font-semibold text-white">
              {isEdit ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded hover:bg-gray-800"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1">
            <Label className="text-[18px] text-white">Title</Label>
            <Input
              placeholder="Enter category title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          {/* Image */}
          <div className="space-y-1">
            <Label className="text-[18px] text-white">Image</Label>
            <Input
              placeholder="Enter image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="h-12 bg-gray-800 text-white placeholder-gray-400"
            />
            <label
              htmlFor="featureImage"
              className="border rounded-md p-6 text-center bg-gray-900 cursor-pointer block mt-2"
            >
              <Upload className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-300">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>

              <input
                id="featureImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    console.log("Selected file:", file);
                    setImage(file.name); // store filename for demo
                  }
                }}
              />
            </label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-[18px] text-white">Description</Label>
            <Input
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 bg-gray-800 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            className="px-6 text-white border-gray-600 hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            className="px-6 bg-white hover:bg-white text-black hover:text-black"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
