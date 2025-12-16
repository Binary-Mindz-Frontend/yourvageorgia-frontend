/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import { getCategories } from "@/services/category/category";
import { ICategory } from "@/types/category.types";
import { createPartner, updatePartner } from "@/services/partner/partner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import LogoUploadWithCrop from "../_components/LogoUploadWithCrop/LogoUploadWithCrop";

type CategoryOption = { _id: string; title: string };
type Contact = { officeName?: string; phone?: string; mobile?: string; email?: string; address?: string; addressUrl?: string; };

interface GalleryItem {
  url: string;
  preview: string | null;
  file: File | null;
}
type Offer = {
  title: string;
  percentage: string;
  description: string;
  validUntil: string;
};
// Add this constant near the top of your file
const ACTIVITY_OPTIONS = [
  "REFORMER_PILATES",
  "SAUNA",
  "MASSAGE",
  "COFFEE",
  "GYM",
  "SPA",
  "PADEL",
] as const;

type ActivityOption = typeof ACTIVITY_OPTIONS[number];

interface FormData {
  categoryId: string;
  name: string;
  thumbnailUrl: string;
  logoUrl: string;
  address: string;
  activity: ActivityOption | ""; // <-- ADD THIS LINE
  isFeatured: boolean;
  offers: Offer[];
  aboutTitle: string;
  aboutDescription: string;
  terms: string[];
  contacts: Contact[];
  website: string;
  instagram: string;
  whatsapp: string;
}

interface AddPartnerPageProps {
  partnerId?: string; // If provided, it's edit mode
  initialCategoryId?: string;
}

export default function AddPartnerPage({ partnerId, initialCategoryId }: AddPartnerPageProps) {
  const isEditMode = !!partnerId;

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPartner, setLoadingPartner] = useState(false);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [ , setLogoPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      categoryId: initialCategoryId || "",
      name: "",
      thumbnailUrl: "",
      logoUrl: "",
      address: "",
      activity: "",
      isFeatured: false,
      offers: [{ title: "", percentage: "", description: "", validUntil: "" }], // Changed
      aboutTitle: "",
      aboutDescription: "",
      terms: [""],
      contacts: [{ officeName: "Head Office" }],
      website: "",
      instagram: "",
      whatsapp: "",
    },
  });

  const terms = watch("terms");
  const contacts = watch("contacts");
  const offers = watch("offers");

  // Add this function near the top of your component, after the imports
const uploadImageToServer = async (file: File | Blob, originalFileName?: string): Promise<string> => {
  const formData = new FormData();
  
  // If it's a Blob (from cropping), create a File object with proper extension
  if (file instanceof Blob && !(file instanceof File)) {
    // Get extension from original filename or default to jpg
    const extension = originalFileName 
      ? originalFileName.split('.').pop() 
      : 'jpg';
    
    // Create a File object with proper name and extension
    const newFile = new File([file], `image.${extension}`, { type: file.type || 'image/jpeg' });
    formData.append('file', newFile);
  } else {
    // It's already a File object, use it directly
    formData.append('file', file);
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_API;
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url || data.data?.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
  // Fetch partner data if in edit mode
  useEffect(() => {
    if (!partnerId) return;

    const fetchPartnerData = async () => {
      setLoadingPartner(true);
      try {
        // Construct the correct API URL
        const apiUrl = process.env.NEXT_PUBLIC_BASE_API;
        const fetchUrl = `${apiUrl}/partner/${partnerId}`;

        const res = await fetch(fetchUrl);
        const json = await res.json();

        if (!res.ok) {
          toast.error(json.message || "Failed to fetch partner data", {
            style: { background: "#000", color: "#fff" },
          });
          return;
        }

        const partner = json.data;

        // Populate form with existing data
        setValue("categoryId", partner.category?._id || partner.category || "");
        setValue("name", partner.name || "");
        setValue("thumbnailUrl", partner.thumbnail || "");
        setValue("logoUrl", partner.logo || "");
        setValue("address", partner.address || "");
        setValue("activity", partner.activity || "", { shouldValidate: true });
        const isFeaturedValue = partner.isFeatured === true || partner.isFeatured === "true";

        setValue("isFeatured", isFeaturedValue, { shouldValidate: true });
        setValue("aboutTitle", partner.about?.title || "");
        setValue("aboutDescription", partner.about?.description || "");
        setValue("terms", partner.terms && partner.terms.length > 0 ? partner.terms : [""]);
        setValue("contacts", partner.contacts && partner.contacts.length > 0 ? partner.contacts : [{ officeName: "Head Office" }]);
        setValue("website", partner.socials?.website || "");
        setValue("instagram", partner.socials?.instagram || "");
        setValue("whatsapp", partner.socials?.whatsapp || "");

        // Set offers data, ensuring proper default values
        if (partner.offer && partner.offer.length > 0) {  // Changed from offers to offer
          setValue("offers", partner.offer.map((o: any) => ({  // Changed from offers to offer
            title: o.title || "",
            percentage: o.offerPercentage?.toString() || "",
            description: o.description || "",
            validUntil: o.validUntil ? o.validUntil.split('T')[0] : "",
          })));
        } else {
          setValue("offers", [{ title: "", percentage: "", description: "", validUntil: "" }]);
        }

        // Set previews for images
        if (partner.thumbnail) setThumbnailPreview(partner.thumbnail);
        if (partner.logo) setLogoPreview(partner.logo);

        // Set gallery images
        if (partner.gallery && partner.gallery.length > 0) {
          const galleryItems = partner.gallery.map((url: string) => ({
            url,
            preview: url,
            file: null,
          }));
          setGallery(galleryItems);
        }

      } catch (err) {
        console.error("Error fetching partner:", err);
        toast.error("Failed to fetch partner data", {
          style: { background: "#000", color: "#fff" }
        });
      } finally {
        setLoadingPartner(false);
      }
    };

    fetchPartnerData();
  }, [partnerId, setValue]);


  const removeThumbnail = () => {
    setThumbnailPreview("");
    setValue("thumbnailUrl", "");
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };


  const handleGalleryFileChange = (files: FileList) => {
    const newImages: GalleryItem[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      url: "",
    }));

    setGallery((prev) => [...prev, ...newImages]);

    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await getCategories();
        if ("error" in res) {
          toast.error(res.error, { style: { background: "#000", color: "#fff" } });
        } else {
          const list: CategoryOption[] = res.data
            .filter((c: ICategory) => c._id)
            .map((c: ICategory) => ({
              _id: c._id!,
              title: c.title,
            }));
          setCategories(list);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories", { style: { background: "#000", color: "#fff" } });
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);


  const previewFile = (file: File, setPreview: (url: string) => void) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const toastStyle = { background: "#000", color: "#fff", marginTop: "4rem" };

const onSubmit = async (data: FormData) => {
  try {
    toast.loading("Uploading images...", { id: "upload-images", style: toastStyle });

    // Upload thumbnail if it's a blob URL
    let thumbnailUrl = data.thumbnailUrl;
    if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
      const blob = await fetch(thumbnailPreview).then(r => r.blob());
      // Determine file extension from blob type
      const extension = blob.type.split('/')[1] || 'jpg';
      const file = new File([blob], `thumbnail.${extension}`, { type: blob.type });
      thumbnailUrl = await uploadImageToServer(file);
    }

    // Upload logo if it's a blob URL
    let logoUrl = data.logoUrl;
    if (logoUrl && logoUrl.startsWith('blob:')) {
      const blob = await fetch(logoUrl).then(r => r.blob());
      const extension = blob.type.split('/')[1] || 'jpg';
      const file = new File([blob], `logo.${extension}`, { type: blob.type });
      logoUrl = await uploadImageToServer(file);
    }

    // Upload gallery images
    const uploadedGalleryUrls: string[] = [];
    for (let i = 0; i < gallery.length; i++) {
      const item = gallery[i];
      if (item.preview && item.preview.startsWith('blob:')) {
        const blob = await fetch(item.preview).then(r => r.blob());
        const extension = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `gallery-${i}.${extension}`, { type: blob.type });
        const uploadedUrl = await uploadImageToServer(file);
        uploadedGalleryUrls.push(uploadedUrl);
      } else if (item.url) {
        uploadedGalleryUrls.push(item.url);
      }
    }

    toast.dismiss("upload-images");

    const payload = {
      category: data.categoryId,
      name: data.name,
      thumbnail: thumbnailUrl,
      address: data.address,
      activity: data.activity || undefined,
      gallery: uploadedGalleryUrls,
      logo: logoUrl,
      isFeatured: data.isFeatured,
      offer: data.offers.map(o => ({
        title: o.title,
        description: o.description,
        validUntil: o.validUntil,
        offerPercentage: o.percentage === "" ? undefined : Number(o.percentage)
      })),
      about: {
        title: data.aboutTitle,
        description: data.aboutDescription,
      },
      terms: data.terms.filter((t) => t.trim()),
      contacts: data.contacts.filter((c) => Object.values(c).some((v) => v && v.trim())),
      socials: {
        website: data.website,
        instagram: data.instagram,
        whatsapp: data.whatsapp,
      },
    };

    console.log("Full Payload Data:", JSON.stringify(payload, null, 2));

    let res;

    if (isEditMode) {
      res = await updatePartner(partnerId, payload);

      if ("error" in res) {
        toast.error("Failed to update partner: " + res.error, { style: toastStyle });
        return;
      }

      toast.success("Partner updated successfully!", { style: toastStyle });
    } else {
      res = await createPartner(payload);

      if ("error" in res) {
        toast.error("Failed to create partner: " + res.error, { style: toastStyle });
        return;
      }

      toast.success("Partner created successfully!", { style: toastStyle });
    }

    setTimeout(() => {
      router.push("/dashboard/admin/partners");
    }, 1500);
  } catch (err: unknown) {
    console.error(err);
    toast.dismiss("upload-images");
    toast.error(`Something went wrong while ${isEditMode ? 'updating' : 'creating'} partner.`, { style: toastStyle });
  }
};

  const handleReset = () => {
    reset();
    setThumbnailPreview(null);
    setLogoPreview(null);
    setGallery([]);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    if (logoInputRef.current) logoInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  if (loadingPartner) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-neutral-950 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <p className="text-white text-xl">Loading partner data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-neutral-950 min-h-screen">
      <h2 className="text-2xl font-semibold text-white mb-6">
        {isEditMode ? "Edit Partner" : "Add New Partner"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* CATEGORY + NAME */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Partner Name */}
          <div>
            <Label className="text-white mb-1">Partner Name *</Label>
            <Input
              {...register("name", { required: "Partner name is required" })}
              className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              placeholder="Partner name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* Category */}
          <div>
            <Label className="text-white mb-1">Category *</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={loadingCategories}
                >
                  <SelectTrigger className="mt-1 w-full bg-neutral-900 border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50 text-white h-auto min-h-12 py-3 items-start">
                    <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 text-white border  ">
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id} className="cursor-pointer">
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        {/* THUMBNAIL + LOGO */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Thumbnail - keep as is */}
          <div>
            <Label className="text-white mb-1">Thumbnail Image *</Label>
            <div className="flex gap-2 mt-1">
              <Input
                {...register("thumbnailUrl", { required: "Thumbnail is required" })}
                placeholder="/uploads/example.jpg or full URL"
                className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              />
              <label className="px-3 py-2 bg-neutral-800 rounded cursor-pointer flex items-center gap-2 text-white hover:bg-neutral-700">
                <Upload size={16} />
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      previewFile(file, setThumbnailPreview);
                      setValue("thumbnailUrl", file.name, { shouldValidate: true });
                    }
                  }}
                />
              </label>
            </div>
            {errors.thumbnailUrl && !thumbnailPreview && (
              <p className="text-red-500 text-sm mt-1">{errors.thumbnailUrl.message}</p>
            )}

            {(thumbnailPreview || watch("thumbnailUrl")) && (
              <div className="mt-2 w-full h-44 relative rounded overflow-hidden border border-neutral-700">
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded w-7 h-7 flex items-center justify-center hover:bg-red-700 z-10"
                >
                  ×
                </button>
                <Image
                  src={thumbnailPreview || watch("thumbnailUrl")}
                  alt="thumb"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Logo Section - Now using the component */}
          <LogoUploadWithCrop
            value={watch("logoUrl") || ""}
            onChange={(value) => setValue("logoUrl", value, { shouldValidate: true })}
            error={errors.logoUrl?.message}
            required={watch("isFeatured")}
          />
        </div>

        {/* ADDRESS + ACTIVITY */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Address Field (First Column) */}
          <div>
            <Label className="text-white mb-1">Address *</Label>
            <Input
              {...register("address", { required: "Address is required" })}
              className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              placeholder="Full address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Activity Select Option (Second Column) */}
          <div>
            <Label className="text-white mb-1">Activity *</Label>
            <Controller
              name="activity"
              control={control}
              rules={{ required: "Activity is required" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                // disabled={loadingActivities} // No loading needed for static list
                >
                  {/* Note: Use the same SelectTrigger classnames for matching style */}
                  <SelectTrigger className="mt-1 w-full bg-neutral-900 border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50 text-white h-auto min-h-12 py-3 items-start">
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 text-white border">
                    {ACTIVITY_OPTIONS.map((activity) => (
                      <SelectItem key={activity} value={activity} className="cursor-pointer">
                        {activity.replace(/_/g, " ")} {/* Optional: Display "REFORMER PILATES" */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.activity && (
              <p className="text-red-500 text-sm mt-1">{errors.activity.message}</p>
            )}
          </div>
        </div>
        {/* GALLERY */}
        <div className="mt-6">
          <Label className="text-white mb-1">Gallery Images</Label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length > 0) {
                handleGalleryFileChange(e.dataTransfer.files);
              }
            }}
            className="mt-2 border-2 border-dashed rounded-md p-6 text-center text-neutral-300 cursor-pointer hover:bg-neutral-800 transition border-neutral-700"
          >
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleGalleryFileChange(e.target.files);
              }}
            />
            <div
              className="flex justify-center items-center gap-2"
              onClick={() => galleryInputRef.current?.click()}
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
                      unoptimized
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
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

        {/* OFFERS */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-white">Offers *</Label>
            <Button
              type="button"
              className="bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
              onClick={() => {
                // Get common description and validUntil from first offer
                const commonDesc = offers.length > 0 ? offers[0].description : "";
                const commonValid = offers.length > 0 ? offers[0].validUntil : "";
                setValue("offers", [...offers, { title: "", percentage: "", description: commonDesc, validUntil: commonValid }]);
              }}
            >
              + Add Offer
            </Button>
          </div>

          {offers.map((offer, i) => (
            <div key={i} className="mt-3 p-4 border bg-neutral-900 border-neutral-700 rounded-md">
              <div className="flex justify-between mb-2">
                <p className="text-white">Offer {i + 1}</p>
                {i > 0 && (
                  <Button
                    type="button"
                    className="bg-neutral-700 hover:bg-neutral-600 text-white"
                    onClick={() => setValue("offers", offers.filter((_, idx) => idx !== i))}
                  >
                    -
                  </Button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-1">Offer Title *</Label>
                  <Input
                    {...register(`offers.${i}.title`, { required: "Offer title is required" })}
                    className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                    placeholder="Offer title"
                  />
                  {errors.offers?.[i]?.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.offers[i]?.title?.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-white mb-1">Offer Percentage *</Label>
                  <Input
                    type="number"
                    {...register(`offers.${i}.percentage`, { required: "Offer percentage is required" })}
                    className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                    placeholder="10"
                  />
                  {errors.offers?.[i]?.percentage && (
                    <p className="text-red-500 text-sm mt-1">{errors.offers[i]?.percentage?.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-white mb-1">Description *</Label>
                <Controller
                  name={`offers.${i}.description`}
                  control={control}
                  rules={{ required: "Offer description is required" }}
                  render={({ field }) => (
                    <Textarea
                      value={field.value}
                      onChange={(e) => {
                        const newDesc = e.target.value;
                        const updatedOffers = offers.map(o => ({ ...o, description: newDesc }));
                        setValue("offers", updatedOffers, { shouldValidate: false });
                      }}
                      className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                      placeholder="Offer description"
                    />
                  )}
                />
                {errors.offers?.[i]?.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.offers[i]?.description?.message}</p>
                )}
              </div>

              <div className="mt-4">
                <Label className="text-white mb-1">Valid Until *</Label>
                <Controller
                  name={`offers.${i}.validUntil`}
                  control={control}
                  rules={{ required: "Valid until date is required" }}
                  render={({ field }) => (
                    <Input
                      type="date"
                      value={field.value}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        const updatedOffers = offers.map(o => ({ ...o, validUntil: newDate }));
                        setValue("offers", updatedOffers, { shouldValidate: false });
                      }}
                      className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                    />
                  )}
                />
                {errors.offers?.[i]?.validUntil && (
                  <p className="text-red-500 text-sm mt-1">{errors.offers[i]?.validUntil?.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ABOUT */}
        <div>
          <Label className="text-white mb-1">About Title *</Label>
          <Input
            {...register("aboutTitle", { required: "About title is required" })}
            className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
          />
          {errors.aboutTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.aboutTitle.message}</p>
          )}
          <Label className="mt-2 block text-white mb-1">About Description *</Label>
          <Textarea
            {...register("aboutDescription", { required: "About description is required" })}
            className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
          />
          {errors.aboutDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.aboutDescription.message}</p>
          )}
        </div>

        {/* TERMS */}
        <div>
          <Label className="text-white mb-1">Terms & Conditions *</Label>
          {terms.map((t, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <Input
                {...register(`terms.${i}`, { required: "Term is required" })}
                className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              />
              {i > 0 && (
                <Button
                  type="button"
                  className="bg-neutral-700 hover:bg-neutral-600 text-white"
                  onClick={() => setValue("terms", terms.filter((_, idx) => idx !== i))}
                >
                  -
                </Button>
              )}
            </div>
          ))}
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">All terms are required</p>
          )}
          <Button
            type="button"
            className="mt-2 cursor-pointer bg-neutral-700 hover:bg-neutral-600"
            onClick={() => setValue("terms", [...terms, ""])}
          >
            + Add Term
          </Button>
        </div>

        {/* CONTACTS */}
        <div>
          <div className="flex justify-between">
            <Label className="text-white">Contacts *</Label>
            <Button
              type="button"
              className="bg-neutral-700 hover:bg-neutral-600"
              onClick={() => {
                if (contacts.length >= 6) {
                  alert("Max 6 contacts allowed");
                  return;
                }
                setValue("contacts", [...contacts, {}]);
              }}
            >
              + Add Contact
            </Button>
          </div>
          {contacts.map((c, i) => (
            <div key={i} className="mt-3 p-4 border bg-neutral-900 text-white border-neutral-700 rounded-md">
              <div className="flex justify-between mb-2">
                <p>Contact {i + 1}</p>
                {i > 0 && (
                  <Button
                    type="button"
                    className="bg-neutral-700 hover:bg-neutral-600 rounded-2xl"
                    onClick={() => setValue("contacts", contacts.filter((_, idx) => idx !== i))}
                  >
                    -
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <Input
                  {...register(`contacts.${i}.officeName`, {
                    required: "Office name is required",
                    minLength: {
                      value: 2,
                      message: "Office name must be at least 2 characters"
                    }
                  })}
                  placeholder="Office Name"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
                <Input
                  {...register(`contacts.${i}.phone`, {
                    required: "Phone is required"
                  })}
                  placeholder="Phone"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
                <Input
                  {...register(`contacts.${i}.mobile`)}
                  placeholder="Mobile"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
                <Input
                  {...register(`contacts.${i}.email`, {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  placeholder="Email"
                  type="email"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
                <Input
                  {...register(`contacts.${i}.address`, {
                    required: "Address is required"
                  })}
                  placeholder="Address"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
                <Input
                  {...register(`contacts.${i}.addressUrl`)}
                  placeholder="Address URL"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
              </div>
            </div>
          ))}
        </div>

        {/* SOCIALS */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-white mb-1">Website *</Label>
            <Input
              {...register("website", { required: "Website is required" })}
              className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
            )}
          </div>
          <div>
            <Label className="text-white mb-1">Instagram *</Label>
            <Input
              {...register("instagram", { required: "Instagram is required" })}
              className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              placeholder="https://instagram.com/..."
            />
            {errors.instagram && (
              <p className="text-red-500 text-sm mt-1">{errors.instagram.message}</p>
            )}
          </div>
          <div>
            <Label className="text-white mb-1">WhatsApp</Label>
            <Input
              {...register("whatsapp")}
              className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              placeholder="https://wa.me/..."
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
            )}
          </div>
        </div>
        {/* FEATURED CHECK */}
        <div className="flex gap-3 items-center">
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="w-4 h-4"
              />
            )}
          />
          <Label className="text-white mb-1">Mark as Featured</Label>
        </div>
        {/* BUTTONS */}
        <div className="flex gap-3">
          <Button type="submit" className=" bg-neutral-700 hover:bg-neutral-600 border-primary/50 cursor-pointer font-normal hover:bg-acent border ">
            {isEditMode ? "Update Partner" : "Save Partner"}
          </Button>
          {
            isEditMode ? " " : (<Button
              type="button"
              className="bg-white cursor-pointer font-normal text-black hover:bg-white"
              onClick={handleReset}
            >
              Reset
            </Button>)
          }
        </div>
      </form>
    </div>
  );
}