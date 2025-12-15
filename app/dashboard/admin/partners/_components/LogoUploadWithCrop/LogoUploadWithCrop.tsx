import { useState, useCallback, useRef } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import Cropper, { Area } from 'react-easy-crop';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LogoUploadWithCropProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  label?: string;
}

export default function LogoUploadWithCrop({
  value,
  onChange,
  error,
  required = false,
  label = "Logo (Recommended 433×160 px)"
}: LogoUploadWithCropProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = document.createElement('img');
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas size to 433x160
    canvas.width = 433;
    canvas.height = 160;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      433,
      160
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropSave = async () => {
    try {
      if (cropImage && croppedAreaPixels) {
        const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
        const croppedImageUrl = URL.createObjectURL(croppedBlob);
        setLogoPreview(croppedImageUrl);
        onChange(croppedImageUrl); // ✅ This correctly passes the blob URL
        setShowCropModal(false);
        setCropImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      }
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    onChange('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  return (
    <div>
      <Label className="text-white mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex gap-2 mt-1">
        <Input
          value={logoPreview ? 'Cropped logo uploaded ✓' : value}
          onChange={(e) => {
            // Only allow manual URL input if there's no cropped image
            if (!logoPreview) {
              onChange(e.target.value);
            }
          }}
          placeholder="https://logo.png or upload image"
          className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
          readOnly={!!logoPreview}
        />
        <label className="px-3 py-2 bg-neutral-800 rounded cursor-pointer flex items-center gap-2 text-white hover:bg-neutral-700">
          <Upload size={16} />
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      </div>
      {error && !logoPreview && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {(logoPreview || value) && (
        <div className="mt-2 h-44 w-full relative rounded overflow-hidden border border-neutral-700">
          <button
            type="button"
            onClick={removeLogo}
            className="absolute top-1 right-1 bg-red-600 text-white rounded w-6 h-6 flex items-center justify-center hover:bg-red-700 z-10"
          >
            ×
          </button>
          <Image
            src={logoPreview || value}
            alt="logo"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && cropImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">
              Crop Logo to 433×160
            </h3>

            <div className="relative w-full h-96 bg-black rounded overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={433 / 160}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-4">
              <Label className="text-white text-sm">Zoom</Label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={handleCropSave}
                className="flex-1 bg-white text-black py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Save Cropped Logo
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCropModal(false);
                  setCropImage(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
                className="flex-1 bg-neutral-700 text-white py-2 rounded hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}