import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface ImageUploadFieldProps {
  label: string;
  required?: boolean;
  value: string;
  preview: string | null;
  error?: string;
  placeholder?: string;
  onFileSelect: (file: File) => void;
  onValueChange: (value: string) => void;
  onRemove: () => void;
}

export default function ImageUploadField({
  label,
  required = false,
  value,
  preview,
  error,
  placeholder = "/uploads/example.jpg or full URL",
  onFileSelect,
  onValueChange,
  onRemove,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <Label className="text-white mb-1">
        {label} {required && "*"}
      </Label>
      <div className="flex gap-2 mt-1">
        <Input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
        />
        <label className="px-3 py-2 bg-neutral-800 rounded cursor-pointer flex items-center gap-2 text-white hover:bg-neutral-700">
          <Upload size={16} />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileSelect(file);
              }
            }}
          />
        </label>
      </div>
      {error && !preview && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {(preview || value) && (
        <div className="mt-2 w-full h-44 relative rounded overflow-hidden border border-neutral-700">
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-600 text-white rounded w-7 h-7 flex items-center justify-center hover:bg-red-700 z-10"
          >
            ×
          </button>
          <Image
            src={preview || value}
            alt={label}
            fill
            sizes="200px"
            className="object-cover"

          />
        </div>
      )}
    </div>
  );
}