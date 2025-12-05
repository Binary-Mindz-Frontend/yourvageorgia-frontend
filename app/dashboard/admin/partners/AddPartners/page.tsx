"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getCategories } from "@/services/category/category";
import { ICategory } from "@/types/category.types";
import { createPartner } from "@/services/partner/partner";

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
} from "@/components/ui/select"

type CategoryOption = { _id: string; title: string };
type Contact = { officeName?: string; phone?: string; mobile?: string; email?: string; address?: string; addressUrl?: string; };

interface AddPartnerPageProps {
  initialCategoryId?: string;
}

export default function AddPartnerPage({ initialCategoryId }: AddPartnerPageProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState(initialCategoryId || "");
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [name, setName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  interface GalleryItem {
    url: string;          // for user input or uploaded URL
    preview: string | null; // local preview from File
    file: File | null;     // the actual File object
  }

  // Update your state - remove the initial empty item
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);


  const [isFeatured, setIsFeatured] = useState(false);

  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerValidUntil, setOfferValidUntil] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");

  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");

  const [terms, setTerms] = useState<string[]>([""]);
  const [contacts, setContacts] = useState<Contact[]>([{ officeName: "Head Office" }]);
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const router = useRouter();
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);


  const removeThumbnail = () => {
    setThumbnailPreview("");
    setThumbnailUrl("");
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const removeLogo = () => {
    setLogoPreview("");
    setLogoUrl("");
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  // Keep this function as is - it's correct
  const handleGalleryFileChange = (files: FileList) => {
    const newImages: GalleryItem[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      url: "",
    }));

    setGallery((prev) => [...prev, ...newImages]);

    // reset input so same file can be uploaded again
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  // FIX: Actually remove the item from array instead of setting it to null
  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, index) => index !== indexToRemove));
  };


  // Fetch all categories for the select options
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await getCategories();
        if ("error" in res) {
          toast.error(res.error, { style: { background: "#000", color: "#fff" } });
        } else {
          const list: CategoryOption[] = res.data
            .filter((c: ICategory) => c._id) // only keep categories with _id
            .map((c: ICategory) => ({
              _id: c._id!, // non-null assertion because we just filtered
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

  const handleSubmit = async () => {
    if (!categoryId) {
      toast.error("Select category", { style: toastStyle });
      return;
    }
    if (!name) {
      toast.error("Enter partner name", { style: toastStyle });
      return;
    }

    const payload = {
      category: categoryId,
      name,
      thumbnail: thumbnailPreview || thumbnailUrl,
      address,
      gallery: gallery
        .filter(g => g.url.trim() || g.preview)
        .map(g => g.preview || g.url),

      logo: logoPreview || logoUrl,
      isFeatured,
      offer: {
        title: offerTitle,
        description: offerDescription,
        validUntil: offerValidUntil,
        offerPercentage: offerPercentage === "" ? undefined : Number(offerPercentage),
      },
      about: {
        title: aboutTitle,
        description: aboutDescription,
      },
      terms: terms.filter((t) => t.trim()),
      contacts: contacts.filter((c) => Object.values(c).some((v) => v && v.trim())),
      socials: {
        website,
        instagram,
        whatsapp,
      },
    };

    try {
      const res = await createPartner(payload);

      if ("error" in res) {
        toast.error("Failed to create partner: " + res.error, { style: toastStyle });
        return;
      }

      toast.success("Partner created successfully!", { style: toastStyle });
      router.push("/dashboard/admin/partners");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Something went wrong while creating partner.", { style: toastStyle });
    }
  };



  return (
    <div className="max-w-5xl mx-auto p-6 bg-neutral-950 min-h-screen">
      <h2 className="text-2xl font-semibold text-white mb-6">Add New Partner</h2>

      <div className="space-y-8">
        {/* CATEGORY + NAME */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Partner Name */}
          <div>
            <Label className="text-white mb-1">Partner Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-900 text-white border-neutral-700"
              placeholder="Partner name"
            />
          </div>
          {/* Category */}
          <div>
            <Label className="text-white mb-1">Category</Label>

            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value)}
              disabled={loadingCategories}
            >
              <SelectTrigger className="mt-1 w-full bg-neutral-900 border border-neutral-700 text-white 
             h-auto min-h-12 py-3 items-start">
                <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
              </SelectTrigger>

              <SelectContent className="bg-neutral-900 text-white border border-neutral-700">
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id} className="cursor-pointer">
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>


        {/* THUMBNAIL + LOGO */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Thumbnail */}
          <div>
            <Label className="text-white mb-1">Thumbnail Image</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="/uploads/example.jpg or full URL"
                className="bg-neutral-900 text-white border-neutral-700"
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
                    if (file) previewFile(file, setThumbnailPreview);
                  }}
                />
              </label>
            </div>

            {(thumbnailPreview || thumbnailUrl) && (
              <div className="mt-2 w-full h-44 relative rounded overflow-hidden border border-neutral-700">
                {/* Remove Button */}
                <button
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded w-7 h-7 flex items-center justify-center hover:bg-red-700 z-10"
                >
                  ×
                </button>

                <Image
                  src={thumbnailPreview || thumbnailUrl}
                  alt="thumb"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Logo */}
          <div>
            <Label className="text-white mb-1">Logo (Recommended 300×300 px)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://logo.png"
                className="bg-neutral-900 text-white border-neutral-700"
              />
              <label className="px-3 py-2 bg-neutral-800 rounded cursor-pointer flex items-center gap-2 text-white hover:bg-neutral-700">
                <Upload size={16} />
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) previewFile(file, setLogoPreview);
                  }}
                />
              </label>
            </div>

            {(logoPreview || logoUrl) && (
              <div className="mt-2 w-24 h-24 relative rounded overflow-hidden border border-neutral-700">
                {/* Remove Button */}
                <button
                  onClick={removeLogo}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded w-6 h-6 flex items-center justify-center hover:hover:bg-red-700 z-10"
                >
                  ×
                </button>

                <Image
                  src={logoPreview || logoUrl}
                  alt="logo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
        {/* Address */}
        <div>
          <Label className="text-white mb-1">Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-neutral-900 text-white border-neutral-700"
            placeholder="Full address"
          />
        </div>

        {/* GALLERY */}
        <div className="mt-6">
          <Label className="text-white mb-1">Gallery Images</Label>

          {/* Drop Zone */}
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

          {/* Preview Grid - Only show if there are actual images */}
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
        {/* OFFER */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-white mb-1">Offer Title</Label>
            <Input
              className="bg-neutral-900 text-white border-neutral-700"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-white mb-1">Offer Percentage</Label>
            <Input
              type="number"
              className="bg-neutral-900 text-white border-neutral-700"
              value={offerPercentage}
              onChange={(e) => setOfferPercentage(e.target.value)}
              placeholder="10"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-white mb-1">Description</Label>
            <Textarea
              className="bg-neutral-900 text-white border-neutral-700"
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-white mb-1">Valid Until</Label>
            <Input
              type="date"
              value={offerValidUntil}
              onChange={(e) => setOfferValidUntil(e.target.value)}
              className="bg-neutral-900 text-white border-neutral-700"
            />
          </div>
        </div>

        {/* ABOUT */}
        <div>
          <Label className="text-white mb-1">About Title</Label>
          <Input
            className="bg-neutral-900 text-white border-neutral-700"
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
          />
          <Label className="mt-2 block text-white mb-1">About Description</Label>
          <Textarea
            className="bg-neutral-900 text-white border-neutral-700"
            value={aboutDescription}
            onChange={(e) => setAboutDescription(e.target.value)}
          />
        </div>

        {/* TERMS */}
        <div>
          <Label className="text-white mb-1">Terms & Conditions</Label>
          {terms.map((t, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <Input
                className="bg-neutral-900 text-white border-neutral-700"
                value={t}
                onChange={(e) => {
                  const list = [...terms];
                  list[i] = e.target.value;
                  setTerms(list);
                }}
              />
              <Button
                type="button"
                className="bg-neutral-700 hover:bg-neutral-600 text-white"
                onClick={() => setTerms(terms.filter((_, idx) => idx !== i))}
              >
                -
              </Button>
            </div>
          ))}
          <Button
            type="button"
            className="mt-2 bg-neutral-700 hover:bg-neutral-600"
            onClick={() => setTerms([...terms, ""])}
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
                setContacts([...contacts, {}]);
              }}
            >
              + Add Contact
            </Button>
          </div>
          {contacts.map((c, i) => (
            <div key={i} className="mt-3 p-4 border bg-neutral-900 text-white border-neutral-700">
              <div className="flex justify-between mb-2">
                <p>Contact {i + 1}</p>
                <Button
                  type="button"
                  className="bg-neutral-700 hover:bg-neutral-600 rounded-2xl"
                  onClick={() => setContacts(contacts.filter((_, idx) => idx !== i))}
                >
                  -
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <Input
                  placeholder="Office Name"
                  className="bg-neutral-800 text-white border-neutral-700"
                  value={c.officeName || ""}
                  onChange={(e) => {
                    const list = [...contacts];
                    list[i] = { ...list[i], officeName: e.target.value };
                    setContacts(list);
                  }}
                />
                <Input
                  placeholder="Phone"
                  className="bg-neutral-800 text-white border-neutral-700"
                  value={c.phone || ""}
                  onChange={(e) => {
                    const list = [...contacts];
                    list[i] = { ...list[i], phone: e.target.value };
                    setContacts(list);
                  }}
                />
                <Input
                  placeholder="Mobile"
                  className="bg-neutral-800 text-white border-neutral-700"
                  value={c.mobile || ""}
                  onChange={(e) => {
                    const list = [...contacts];
                    list[i] = { ...list[i], mobile: e.target.value };
                    setContacts(list);
                  }}
                />
                <Input
                  placeholder="Email"
                  className="bg-neutral-800 text-white border-neutral-700"
                  value={c.email || ""}
                  onChange={(e) => {
                    const list = [...contacts];
                    list[i] = { ...list[i], email: e.target.value };
                    setContacts(list);
                  }}
                />
                <Input
                  placeholder="Address"
                  className="bg-neutral-800 text-white md:col-span-2 border-neutral-700"
                  value={c.address || ""}
                  onChange={(e) => {
                    const list = [...contacts];
                    list[i] = { ...list[i], address: e.target.value };
                    setContacts(list);
                  }}
                />
                <Input
                  placeholder="Address URL"
                  className="bg-neutral-800 text-white md:col-span-2 border-neutral-700"
                  value={c.addressUrl || ""}
                  onChange={(e) => {
                    const list = [...contacts];
                    list[i] = { ...list[i], addressUrl: e.target.value };
                    setContacts(list);
                  }}
                />
              </div>
            </div>
          ))}
        </div>


        {/* SOCIALS */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-white mb-1">Website</Label>
            <Input
              className="bg-neutral-900 text-white border-neutral-700"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <Label className="text-white mb-1">Instagram</Label>
            <Input
              className="bg-neutral-900 text-white border-neutral-700"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <Label className="text-white mb-1">WhatsApp</Label>
            <Input
              className="bg-neutral-900 text-white border-neutral-700"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="https://wa.me/..."
            />
          </div>
        </div>

        {/* FEATURED CHECK */}
        <div className="flex gap-3 items-center">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4"
          />
          <Label className="text-white mb-1">Mark as Featured</Label>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="bg-black hover:bg-black border border-white">
            Save Partner
          </Button>
          <Button
            type="button"
            className="bg-neutral-700 hover:bg-neutral-600"
            onClick={() => window.location.reload()}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}