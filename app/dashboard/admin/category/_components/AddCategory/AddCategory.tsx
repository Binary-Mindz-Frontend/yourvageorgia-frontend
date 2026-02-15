import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
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
import {
  createCategory,
  ICategory,
  ICategoryResponse,
  ICategoryWithId,
  updateCategory,
} from "@/services/category/category";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Backend base URL
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_API;

type AddCategoryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  initialData?: ICategoryWithId;
  onCategoryAdded?: (newCategory: ICategoryWithId) => void;
};

export default function AddCategoryModal({
  open,
  onOpenChange,
  isEdit = false,
  initialData,
  onCategoryAdded,
}: AddCategoryProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);



  // Reset fields when modal opens or initialData changes
  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || "");
      setImage(initialData.image || "");
      setDescription(initialData.description || "");
    } else {
      setTitle("");
      setImage("");
      setDescription("");
    }
  }, [isEdit, initialData, open]);

  // Handle file selection and upload
  const handleFileChange = async (file: File) => {
    // Block SVG
    if (
      file.type === "image/svg+xml" ||
      file.name.toLowerCase().endsWith(".svg")
    ) {
      toast.error("Please upload image PNG, JPG, JPEG");

      // reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

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
        console.error(data.message || "Failed to upload image");
        return;
      }

      setImage(data.data.url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  const handleImageRemove = () => {
    setImage(""); // Remove the image
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title || !image) {
      toast.error("Title and Image are required");
      return;
    }

    const data: ICategory = { title, image, description };
    setLoading(true);

    try {
      let res: ICategoryResponse | { error: string };

      if (isEdit && initialData?._id) {
        // Update category
        res = await updateCategory(initialData._id, data);
      } else {
        // Create new category
        res = await createCategory(data);
      }

      if ("error" in res) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      if (onCategoryAdded) onCategoryAdded(res.data);

      toast.success(
        `${res.data.title} ${isEdit ? "updated" : "added"} successfully!`
      );

      onOpenChange(false);

      // Reset only on Add
      if (!isEdit) {
        setTitle("");
        setImage("");
        setDescription("");
      }
    } catch (err: unknown) {
      console.error("Category error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 rounded-2xl [&>button]:hidden bg-[#1a1a1a] text-white">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-sm font-semibold text-white">
              {isEdit ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded hover:bg-bl transition-colors"
            >
              <X className="h-5 w-5 text-white cursor-pointer" />
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
              className="h-12 text-white placeholder-gray-400 bg-accent/10 border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
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
              className="h-12 text-white placeholder-gray-400 bg-accent/10 border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              disabled={loading || uploading}
            />

            {/* Preview */}
            {image && (
              <div className="mt-2 w-full h-60 relative rounded border border-gray-700 overflow-hidden">
                <Image
                  src={image}
                  alt="Preview"
                  fill
                  className="object-cover"

                />
                {/* Cross Icon */}
                <button
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-md"
                  onClick={handleImageRemove}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <label
              htmlFor="featureImage"
              className={`border border-primary/50 rounded-md p-6 text-center bg-[#1a1a1a] cursor-pointer block mt-2 hover:bg-accent/10 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""
                }`}
            >
              <Upload className="mx-auto mb-2 text-gray-400" />
              <div className="text-sm text-gray-400">
                {uploading
                  ? <BeautifulLoader size="sm" text="Uploading..." />
                  : "Click to upload or drag and drop"}
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>

              <input
                ref={fileInputRef}
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
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-[18px] text-white">Description</Label>
            <textarea
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-white border placeholder-gray-400 bg-accent/10 border-primary/50 focus:outline-none resize-none h-24 p-2 rounded-md "
              disabled={loading || uploading}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            className="px-6 text-white border-gray-600 hover:bg-acent/10 cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={loading || uploading}
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            className="px-6 bg-white text-black hover:text-black hover:bg-white cursor-pointer border-primary/50"
            onClick={handleSubmit}
            disabled={loading || uploading}
          >
            {loading
              ? <BeautifulLoader size="sm" text={isEdit ? "Updating..." : "Adding..."} />
              : uploading
                ? "Uploading..."
                : isEdit
                  ? "Update"
                  : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
