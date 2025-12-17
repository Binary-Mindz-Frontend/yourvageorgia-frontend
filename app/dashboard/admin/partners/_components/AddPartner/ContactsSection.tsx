import React from "react";
import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PartnerContact } from "@/types/partner.types";

interface ContactsSectionProps<T extends FieldValues = FieldValues> {
  contacts: PartnerContact[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  maxContacts?: number;
}

export default function ContactsSection<T extends FieldValues = FieldValues>({
  contacts,
  register,
  errors,
  onAdd,
  onRemove,
  maxContacts = 6,
}: ContactsSectionProps<T>) {
  const handleAdd = () => {
    if (contacts.length >= maxContacts) {
      alert(`Max ${maxContacts} contacts allowed`);
      return;
    }
    onAdd();
  };

  return (
    <div>
      <div className="flex justify-between">
        <Label className="text-white">Contacts *</Label>
        <Button
          type="button"
          className="bg-neutral-700 hover:bg-neutral-600"
          onClick={handleAdd}
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
                onClick={() => onRemove(i)}
              >
                -
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div>
              <Input
                {...register(`contacts.${i}.officeName` as Path<T>, {
                  required: "Office name is required",
                  minLength: {
                    value: 2,
                    message: "Office name must be at least 2 characters"
                  }
                })}
                placeholder="Office Name"
                className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              />
              {errors.contacts && Array.isArray(errors.contacts) && errors.contacts[i]?.officeName && (
                <p className="text-red-500 text-xs mt-1">
                  {String(errors.contacts[i]?.officeName?.message || "Office name is required")}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register(`contacts.${i}.phone` as Path<T>, {
                  required: "Phone is required"
                })}
                placeholder="Phone"
                className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              />
              {errors.contacts && Array.isArray(errors.contacts) && errors.contacts[i]?.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {String(errors.contacts[i]?.phone?.message || "Phone is required")}
                </p>
              )}
            </div>
            <Input
              {...register(`contacts.${i}.mobile` as Path<T>)}
              placeholder="Mobile"
              className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
            />
            <div>
              <Input
                {...register(`contacts.${i}.email` as Path<T>, {
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
              {errors.contacts && Array.isArray(errors.contacts) && errors.contacts[i]?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {String(errors.contacts[i]?.email?.message || "Email is required")}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register(`contacts.${i}.address` as Path<T>, {
                  required: "Address is required"
                })}
                placeholder="Address"
                className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
              />
              {errors.contacts && Array.isArray(errors.contacts) && errors.contacts[i]?.address && (
                <p className="text-red-500 text-xs mt-1">
                  {String(errors.contacts[i]?.address?.message || "Address is required")}
                </p>
              )}
            </div>
            <Input
              {...register(`contacts.${i}.addressUrl` as Path<T>)}
              placeholder="Address URL"
              className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
            />
          </div>
        </div>
      ))}
    </div>
  );
}