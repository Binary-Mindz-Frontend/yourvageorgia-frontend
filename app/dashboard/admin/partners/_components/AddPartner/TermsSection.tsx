import React from "react";
import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TermsSectionProps<T extends FieldValues = FieldValues> {
  terms: string[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function TermsSection<T extends FieldValues = FieldValues>({
  terms,
  register,
  errors,
  onAdd,
  onRemove,
}: TermsSectionProps<T>) {
  return (
    <div>
      <Label className="text-white mb-1">Terms & Conditions *</Label>
      {terms.map((t, i) => (
        <div key={i} className="flex gap-2 mt-2">
          <Input
            {...register(`terms.${i}` as Path<T>, { required: "Term is required" })}
            className="bg-neutral-900 text-white border border-primary/50 focus:outline-none focus:ring-0 focus:border-primary/50"
            placeholder={`Term ${i + 1}`}
          />
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
      ))}
      {errors.terms && (
        <p className="text-red-500 text-sm mt-1">All terms are required</p>
      )}
      <Button
        type="button"
        className="mt-2 cursor-pointer bg-neutral-700 hover:bg-neutral-600"
        onClick={onAdd}
      >
        + Add Term
      </Button>
    </div>
  );
}