import React from "react";
import { UseFormRegister, FieldErrors, Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PartnerOffer } from "@/types/partner.types";

type Offer = PartnerOffer & { percentage: string };

interface OffersSectionProps<T extends FieldValues = FieldValues> {
  offers: Offer[];
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onDescriptionChange: (newDesc: string) => void;
  onValidUntilChange: (newDate: string) => void;
}

export default function OffersSection<T extends FieldValues = FieldValues>({
  offers,
  register,
  control,
  errors,
  onAdd,
  onRemove,
  onDescriptionChange,
  onValidUntilChange,
}: OffersSectionProps<T>) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <Label className="text-white">Offers *</Label>
        <Button
          type="button"
          className="bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
          onClick={onAdd}
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
                onClick={() => onRemove(i)}
              >
                -
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-1">Offer Title *</Label>
              <Input
                {...register(`offers.${i}.title` as Path<T>, { required: "Offer title is required" })}
                className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                placeholder="Offer title"
              />
              {errors.offers && Array.isArray(errors.offers) && errors.offers[i]?.title && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.offers[i]?.title?.message || "Offer title is required")}
                </p>
              )}
            </div>
            <div>
              <Label className="text-white mb-1">Offer Percentage *</Label>
              <Input
                type="number"
                {...register(`offers.${i}.percentage` as Path<T>, { required: "Offer percentage is required" })}
                className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                placeholder="10"
              />
              {errors.offers && Array.isArray(errors.offers) && errors.offers[i]?.percentage && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.offers[i]?.percentage?.message || "Offer percentage is required")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-white mb-1">Description *</Label>
            <Controller
              name={`offers.${i}.description` as Path<T>}
              control={control}
              rules={{ required: "Offer description is required" }}
              render={({ field }) => (
                <Textarea
                  value={field.value}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                  placeholder="Offer description"
                />
              )}
            />
            {errors.offers && Array.isArray(errors.offers) && errors.offers[i]?.description && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.offers[i]?.description?.message || "Offer description is required")}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Label className="text-white mb-1">Valid Until *</Label>
            <Controller
              name={`offers.${i}.validUntil` as Path<T>}
              control={control}
              rules={{ required: "Valid until date is required" }}
              render={({ field }) => (
                <Input
                  type="date"
                  value={field.value}
                  onChange={(e) => onValidUntilChange(e.target.value)}
                  className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
                />
              )}
            />
            {errors.offers && Array.isArray(errors.offers) && errors.offers[i]?.validUntil && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.offers[i]?.validUntil?.message || "Valid until date is required")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}