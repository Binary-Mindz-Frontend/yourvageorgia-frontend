
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { getCategoriesForSelect } from "@/services/category/category";
import { createPartner, updatePartner } from "@/services/partner/partner";
import { ICategory } from "@/types/category.types";

import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getActivitiesForSelect } from "@/services/activity/activity";
import { PartnerContact } from "@/types/partner.types";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import LogoUploadWithCrop from "../_components/LogoUploadWithCrop/LogoUploadWithCrop";

type CategoryOption = { _id: string; title: string };

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

type ActivityOption = { _id: string; title: string };

interface FormData {
  categories: string[];
  name: string;
  thumbnailUrl: string;
  logoUrl: string;
  activity: string[];
  isFeatured: boolean;
  isFeaturedMap: boolean;
  genderPreference: 'mixed' | 'womenOnly';
  offers: Offer[];
  about: string;
  terms: string[];
  contacts: PartnerContact[];
  website: string;
  instagram: string;
  whatsapp: string;
  coupon: string;
}

interface AddPartnerPageProps {
  partnerId?: string;
  initialCategoryId?: string;

}

export default function AddPartnerPage({ partnerId, initialCategoryId }: AddPartnerPageProps) {
  const isEditMode = !!partnerId;

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPartner, setLoadingPartner] = useState(false);

  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [, setLogoPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const hasInitialized = useRef(false);
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
      categories: initialCategoryId ? [initialCategoryId] : [], // Changed
      name: "",
      thumbnailUrl: "",
      logoUrl: "",
      activity: [],
      isFeatured: false,
      isFeaturedMap: false,
      genderPreference: 'mixed',
      offers: [{ title: "", percentage: "", description: "", validUntil: "" }],
      about: "",
      terms: [""],
      contacts: [],
      website: "",
      instagram: "",
      whatsapp: "",
      coupon: "",
    },
  });

  const terms = watch("terms");
  const contacts = watch("contacts");
  const offers = watch("offers");

  const uploadImageToServer = async (file: File | Blob, originalFileName?: string): Promise<string> => {
    const formData = new FormData();

    if (file instanceof Blob && !(file instanceof File)) {
      const extension = originalFileName
        ? originalFileName.split('.').pop()
        : 'jpg';

      const newFile = new File([file], `image.${extension}`, { type: file.type || 'image/jpeg' });
      formData.append('file', newFile);
    } else {
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

  useEffect(() => {
    if (!partnerId || hasInitialized.current) return;

    const fetchPartnerData = async () => {
      setLoadingPartner(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BASE_API;
        const res = await fetch(`${apiUrl}/partner/${partnerId}`);
        const json = await res.json();

        if (!res.ok) return;

        const partner = json.data;

        // Handle categories array
        if (partner.categories && Array.isArray(partner.categories)) {
          setValue("categories", partner.categories.map((cat: any) =>
            typeof cat === 'string' ? cat : cat._id
          ));
        } else if (partner.category) {
          // Fallback for old single category
          const catId = typeof partner.category === 'string' ? partner.category : partner.category._id;
          setValue("categories", [catId]);
        }

        setValue("name", partner.name || "");
        setValue("thumbnailUrl", partner.thumbnail || "");
        setValue("logoUrl", partner.logo || "");
        setValue("activity", partner.activity || []);
        setValue("isFeatured", partner.isFeatured === true || partner.isFeatured === "true");
        setValue("isFeaturedMap", partner.isFeaturedMap === true || partner.isFeaturedMap === "true");
        setValue("coupon", partner.coupon || "");

        // Handle gender preference
        if (partner.womenOnly === true || partner.womenOnly === "true") {
          setValue("genderPreference", 'womenOnly');
        } else if (partner.mixed === true || partner.mixed === "true") {
          setValue("genderPreference", 'mixed');
        } else {
          setValue("genderPreference", 'mixed'); // default
        }


        setValue("about", partner.about || "");
        setValue("terms", partner.terms?.length ? partner.terms : [""]);
        setValue(
          "contacts",
          partner.contacts?.length ? partner.contacts : [{ officeName: "Head Office" }]
        );

        setValue("website", partner.socials?.website || "");
        setValue("instagram", partner.socials?.instagram || "");
        setValue("whatsapp", partner.socials?.whatsapp || "");

        setValue(
          "offers",
          partner.offer?.length
            ? partner.offer.map((o: any) => ({
              title: o.title || "",
              percentage: o.offerPercentage?.toString() || "",
              description: o.description || "",
              validUntil: o.validUntil ? o.validUntil.split("T")[0] : "",
            }))
            : [{ title: "", percentage: "", description: "", validUntil: "" }]
        );

        if (partner.thumbnail) setThumbnailPreview(partner.thumbnail);
        if (partner.logo) setLogoPreview(partner.logo);

        if (partner.gallery?.length) {
          setGallery(
            partner.gallery.map((url: string) => ({
              url,
              preview: url,
              file: null,
            }))
          );
        }

        hasInitialized.current = true;
      } catch (e) {
        console.error(e);
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
  }

  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoadingActivities(true);
      try {
        const res = await getActivitiesForSelect();
        if ("error" in res) {
          toast.error(res.error);
        } else {
          const list: ActivityOption[] = res.data.map((a) => ({
            _id: a._id,
            title: a.title,
          }));
          setActivities(list);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch activities");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await getCategoriesForSelect();
        if ("error" in res) {
          toast.error(res.error);
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
        toast.error("Failed to fetch categories");
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


  const onSubmit = async (data: FormData) => {
    const unauthorizedMessage = "Session expired or unauthorized. Please log in again.";

    const handleAuthError = (errorMessage: string) => {
      if (errorMessage.includes(unauthorizedMessage)) {
        toast.error("Session expired. Redirecting to login...");

        setTimeout(() => {
          router.push("/dashboard/admin/login");
        }, 1500);
        return true;
      }
      return false;
    };

    try {
      toast.loading("Uploading images...", { id: "upload-images" });

      let thumbnailUrl = data.thumbnailUrl;
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        const blob = await fetch(thumbnailPreview).then(r => r.blob());
        const extension = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `thumbnail.${extension}`, { type: blob.type });
        thumbnailUrl = await uploadImageToServer(file);
      }

      let logoUrl = data.logoUrl;
      if (logoUrl && logoUrl.startsWith('blob:')) {
        const blob = await fetch(logoUrl).then(r => r.blob());
        const extension = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `logo.${extension}`, { type: blob.type });
        logoUrl = await uploadImageToServer(file);
      }

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
        categories: data.categories,
        name: data.name,
        thumbnail: thumbnailUrl,
        activity: data.activity.length > 0 ? data.activity : undefined,
        gallery: uploadedGalleryUrls,
        logo: logoUrl,
        isFeatured: data.isFeatured,
        isFeaturedMap: data.isFeaturedMap,
        womenOnly: data.genderPreference === 'womenOnly',
        mixed: data.genderPreference === 'mixed',
        coupon: data.coupon,
        offer: data.offers.map(o => ({
          title: o.title,
          description: o.description,
          validUntil: o.validUntil,
          offerPercentage: o.percentage === "" ? undefined : Number(o.percentage)
        })),
        about: data.about || "",
        terms: data.terms.filter((t: string) => t.trim()),
        contacts: data.contacts.filter((c: any) => {
          return c.officeName || c.phone || c.address || c.area || c.email;
        }),
        socials: {
          website: data.website,
          instagram: data.instagram,
          whatsapp: data.whatsapp,
        },
      };

      let res;

      if (isEditMode) {
        res = await updatePartner(partnerId!, payload);

        if ("error" in res) {
          if (handleAuthError(res.error)) {
            return;
          }
          toast.error("Failed to update partner: " + res.error);
          return;
        }
        toast.success("Partner updated successfully");
      } else {
        res = await createPartner(payload);

        if ("error" in res) {
          if (handleAuthError(res.error)) {
            return;
          }

          toast.error("Failed to create partner: " + res.error);
          return;
        }

        toast.success("Partner created successfully");
      }

      setTimeout(() => {
        router.push("/dashboard/admin/partners");
      }, 1500);

    } catch (err: unknown) {
      console.error(err);
      toast.dismiss("upload-images");

      const errorMessage = err instanceof Error ? err.message : `Something went wrong while ${isEditMode ? 'updating' : 'creating'} partner.`;

      if (handleAuthError(errorMessage)) {
        return;
      }

      toast.error(errorMessage);
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
          <BeautifulLoader text="Loading partner data" />
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
        {/* PARTNER NAME + CATEGORIES */}
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

          {/* Categories Multi-Select with Dropdown */}
          <div>
            <Label className="text-white mb-1">Categories *</Label>
            <Controller
              name="categories"
              control={control}
              rules={{ required: "At least one category is required" }}
              render={({ field }) => (
                <div>
                  <Select
                    disabled={loadingCategories}
                    onValueChange={(value) => {
                      if (!field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-1 w-full bg-neutral-900 border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50 text-white h-auto min-h-12 py-3 items-start">
                      <SelectValue placeholder={loadingCategories ? <BeautifulLoader size="sm" /> : "Select categories"} />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white border max-h-60 overflow-y-auto">
                      {categories
                        .filter(c => !field.value.includes(c._id))
                        .map((c) => (
                          <SelectItem key={c._id} value={c._id} className="cursor-pointer">
                            {c.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {/* Selected Categories Display */}
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((catId) => {
                        const category = categories.find(c => c._id === catId);
                        return (
                          <div
                            key={catId}
                            className="flex items-center gap-2 bg-black border text-white px-3 py-1 rounded-full text-sm"
                          >
                            <span>{category?.title || catId}</span>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(field.value.filter(id => id !== catId));
                              }}
                              className="hover:bg-primary/80 cursor-pointer rounded-full"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            />
            {errors.categories && (
              <p className="text-red-500 text-sm mt-1">{errors.categories.message}</p>
            )}
          </div>
        </div>

        {/* THUMBNAIL + LOGO */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Thumbnail */}
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

                />
              </div>
            )}
          </div>

          {/* Logo Section */}
          <LogoUploadWithCrop
            value={watch("logoUrl") || ""}
            onChange={(value) => setValue("logoUrl", value, { shouldValidate: true })}
            error={errors.logoUrl?.message}
            required={watch("isFeatured")}
          />
        </div>

        {/* ACTIVITY */}
        <div>
          <Label className="text-white mb-1">Activity *</Label>
          <Controller
            name="activity"
            control={control}
            rules={{ required: "At least one activity is required" }}
            render={({ field }) => (
              <div>
                <Select
                  disabled={loadingActivities}
                  onValueChange={(value) => {
                    if (!field.value.includes(value)) {
                      field.onChange([...field.value, value]);
                    }
                  }}
                >
                  <SelectTrigger className="mt-1 w-full bg-neutral-900 border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50 text-white h-auto min-h-12 py-3 items-start">
                    <SelectValue placeholder={loadingActivities ? <BeautifulLoader size="sm" /> : "Select activities"} />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 text-white border max-h-60 overflow-y-auto">
                    {activities
                      .filter(a => !field.value.includes(a._id))
                      .map((a) => (
                        <SelectItem key={a._id} value={a._id} className="cursor-pointer">
                          {a.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* Selected Activities Display */}
                {field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((actId) => {
                      const activity = activities.find(a => a._id === actId);
                      return (
                        <div
                          key={actId}
                          className="flex items-center gap-2 bg-black border text-white px-3 py-1 rounded-full text-sm"
                        >
                          <span>{activity?.title || actId}</span>
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange(field.value.filter(id => id !== actId));
                            }}
                            className="hover:bg-primary/80 cursor-pointer rounded-full"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          />
          {errors.activity && (
            <p className="text-red-500 text-sm mt-1">{errors.activity.message}</p>
          )}
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
            </div>
          ))}
        </div>

        {/* ABOUT */}
        <div>
          <Label className="text-white mb-1">About *</Label>
          <Controller
            name="about"
            control={control}
            defaultValue=""
            rules={{ required: "About description is required" }}
            render={({ field }) => (
              <Textarea
                {...field}
                className="bg-neutral-900 text-white border border-primary/50"
                rows={5}
                placeholder="Describe the partner..."
              />
            )}
          />

          {errors.about && (
            <p className="text-red-500 text-sm mt-1">{errors.about.message}</p>
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
                  onClick={() =>
                    setValue(
                      "terms",
                      terms.filter((_, idx) => idx !== i)
                    )
                  }
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
            <Label className="text-white">Contacts</Label>
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
            <div
              key={i}
              className="mt-3 p-4 border bg-neutral-900 text-white border-neutral-700 rounded-md"
            >
              <div className="flex justify-between mb-2">
                <p>Contact {i + 1}</p>
                {i > 0 && (
                  <Button
                    type="button"
                    className="bg-neutral-700 hover:bg-neutral-600 rounded-2xl"
                    onClick={() =>
                      setValue(
                        "contacts",
                        contacts.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    -
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {/* Row 1: Office Name and Phone */}
                <Input
                  {...register(`contacts.${i}.officeName`, {
                    minLength: {
                      value: 2,
                      message: "Office name must be at least 2 characters",
                    },
                  })}
                  placeholder="Office Name"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
                <Input
                  {...register(`contacts.${i}.phone`)}
                  placeholder="Phone"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />

                {/* Row 2: Mobile and Email */}
                <Input
                  {...register(`contacts.${i}.mobile`)}
                  placeholder="Mobile"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
                <Input
                  {...register(`contacts.${i}.email`, {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  placeholder="Email"
                  type="email"
                  spellCheck={false}
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />

                {/* Row 3: Address and Area */}
                <Input
                  {...register(`contacts.${i}.address`)}
                  placeholder="Address"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
                <Input
                  {...register(`contacts.${i}.area`)}
                  placeholder="Area"
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />

                {/* Row 4: Address URL (Full Width) */}
                <div className="md:col-span-2">
                  {" "}
                  {/* THIS MAKES IT FULL WIDTH */}
                  <Input
                    {...register(`contacts.${i}.addressUrl`)}
                    placeholder="Address URL"
                    className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                  />
                </div>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.website.message}
              </p>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.instagram.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-white mb-1">WhatsApp</Label>
            <Input
              {...register("whatsapp")}
              className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              placeholder="9123......"
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">
                {errors.whatsapp.message}
              </p>
            )}
          </div>
        </div>

        {/* COUPON */}
        <div>
          <Label className="text-white mb-1">Coupon</Label>
          <Input
            {...register("coupon")}
            className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
            placeholder="Coupon Code"
          />
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
        {/* isFeaturedMap CHECKBOX (OPTIONAL) */}
        <div className="flex gap-3 items-center">
          <Controller
            name="isFeaturedMap"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value ?? false}
                onChange={(e) => field.onChange(e.target.checked)}
                className="w-4 h-4"
              />
            )}
          />
          <Label className="text-white mb-1">isFeaturedMap</Label>
        </div>

        {/* GENDER PREFERENCE */}
        <div>
          <Label className="text-white mb-4">Gender Preference *</Label>
          <Controller
            name="genderPreference"
            control={control}
            render={({ field }) => (
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="mixed"
                    checked={field.value === 'mixed'}
                    onChange={() => field.onChange('mixed')}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Mixed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="womenOnly"
                    checked={field.value === 'womenOnly'}
                    onChange={() => field.onChange('womenOnly')}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Woman Only</span>
                </label>
              </div>
            )}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <Button
            type="submit"
            className=" bg-neutral-700 hover:bg-neutral-600 border-primary/50 cursor-pointer font-normal hover:bg-acent border "
          >
            {isEditMode ? "Update Partner" : "Save Partner"}
          </Button>
          {isEditMode ? (
            " "
          ) : (
            <Button
              type="button"
              className="bg-white cursor-pointer font-normal text-black hover:bg-white"
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
