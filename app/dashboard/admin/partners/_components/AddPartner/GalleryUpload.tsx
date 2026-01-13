import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export interface GalleryItem {
  url: string;
  preview: string | null;
  file: File | null;
}

interface GalleryUploadProps {
  label?: string;
  gallery: GalleryItem[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
}

export default function GalleryUpload({
  label = "Gallery Images",
  gallery,
  onAdd,
  onRemove,
}: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="mt-6">
      <Label className="text-white mb-1">{label}</Label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length > 0) {
            onAdd(e.dataTransfer.files);
          }
        }}
        className="mt-2 border-2 border-dashed rounded-md p-6 text-center text-neutral-300 cursor-pointer hover:bg-neutral-800 transition border-neutral-700"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onAdd(e.target.files);
          }}
        />
        <div
          className="flex justify-center items-center gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={18} />
          <span>Click or drag & drop images</span>
        </div>
      </div>

      {gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {gallery.map((item: GalleryItem, index: number) => (
            <div
              key={index}
              className="relative w-full h-32 rounded overflow-hidden border border-neutral-700"
            >
              {item.preview && (
                <Image
                  src={item.preview}
                  alt={`gallery-${index}`}
                  fill
                  className="object-cover"

                />
              )}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}