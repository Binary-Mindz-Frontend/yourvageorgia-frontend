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
import Image from "next/image";

// Backend base URL
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

type AddCategoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  initialData?: ICategory;
  onCategoryAdded?: (newCategory: ICategory) => void;
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
  const [uploading, setUploading] = useState(false);

  // Handle file selection and upload
  const handleFileChange = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BACKEND_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to upload image", { 
          style: { background: "#000", color: "#fff" } 
        });
        return;
      }

      // Extract the uploaded file URL from the response
      const uploadedUrl = data.data.url;
      setImage(uploadedUrl);
      
      toast.success("Image uploaded successfully!", { 
        style: { background: "#000", color: "#fff" } 
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed", { 
        style: { background: "#000", color: "#fff" } 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!title || !image) {
      toast.error("Title and Image are required", { 
        style: { background: "#000", color: "#fff" } 
      });
      return;
    }

    const data: ICategory = { title, image, description };
    setLoading(true);

    try {
      const res: ICategoryResponse | { error: string } = await createCategory(data);

      if ("error" in res) {
        toast.error(res.error, { 
          style: { background: "#000", color: "#fff" } 
        });
        setLoading(false);
        return;
      }

      if (onCategoryAdded) onCategoryAdded(res.data);

      toast.success(`${res.data.title} added successfully!`, { 
        style: { background: "#000", color: "#fff" } 
      });

      onOpenChange(false);

      // Reset form
      setTitle("");
      setImage("");
      setDescription("");
    } catch (err: unknown) {
      console.error("Create category error:", err);
      toast.error("Something went wrong", { 
        style: { background: "#000", color: "#fff" } 
      });
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
              className="p-2 rounded hover:bg-gray-800 transition-colors"
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
              className="h-12 bg-gray-800 text-white placeholder-gray-400 border-gray-700"
              disabled={loading || uploading}
            />
          </div>

          {/* Image */}
          <div className="space-y-1">
            <Label className="text-[18px] text-white">Image</Label>
            <Input
              placeholder="Enter image URL or upload below"
              value={image}
              onChange={(e) => setImage(e.target.value.trim())}
              className="h-12 bg-gray-800 text-white placeholder-gray-400 border-gray-700"
              disabled={loading || uploading}
            />
            <label
              htmlFor="featureImage"
              className={`border border-gray-700 rounded-md p-6 text-center bg-gray-900 cursor-pointer block mt-2 hover:bg-gray-800 transition-colors ${
                uploading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Upload className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-300">
                {uploading ? "Uploading..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>

              <input
                id="featureImage"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
            </label>

            {/* Preview uploaded image */}
            {image && (
              <div className="mt-3 flex justify-center">
                <div className="relative">
                  <Image
                    key={image}
                    src={image}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="object-cover rounded border border-gray-600"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-[18px] text-white">Description</Label>
            <Input
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 bg-gray-800 text-white placeholder-gray-400 border-gray-700"
              disabled={loading || uploading}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            className="px-6 text-white border-gray-600 hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
            disabled={loading || uploading}
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            className="px-6 bg-white hover:bg-white text-black hover:text-black"
            onClick={handleAdd}
            disabled={loading || uploading}
          >
            {loading ? "Adding..." : uploading ? "Uploading..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}