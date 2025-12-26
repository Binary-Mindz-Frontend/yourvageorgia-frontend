"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "delete";
  inputValue: string;
  onInputChange: (value: string) => void;
  onConfirm: () => void;
  loading: boolean;
  activityTitle?: string;
}

const ActivityDialog: React.FC<ActivityDialogProps> = ({
  open,
  onOpenChange,
  mode,
  inputValue,
  onInputChange,
  onConfirm,
  loading,
  activityTitle,
}) => {
  const getDialogConfig = () => {
    switch (mode) {
      case "add":
        return {
          title: "Add Activity",
          placeholder: "Enter activity title",
          confirmText: loading ? "Adding..." : "Add",
          cancelVariant: "outline" as const,
          confirmVariant: undefined,
          cancelClass: "cursor-pointer bg-black text-white hover:bg-black hover:text-white",
          confirmClass: "rounded-md cursor-pointer bg-white text-black",
        };
      case "edit":
        return {
          title: "Edit Activity",
          placeholder: "Edit activity title",
          confirmText: loading ? "Updating..." : "Update",
          cancelVariant: "outline" as const,
          confirmVariant: undefined,
          cancelClass: "cursor-pointer bg-white text-black hover:bg-white hover:text-black",
          confirmClass: "cursor-pointer rounded-md bg-black",
        };
      case "delete":
        return {
          title: "Confirm Delete",
          placeholder: "",
          confirmText: loading ? "Deleting..." : "Delete",
          cancelVariant: "outline" as const,
          confirmVariant: "destructive" as const,
          cancelClass: "",
          confirmClass: "",
        };
    }
  };

  const config = getDialogConfig();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-[#1a1a1a] text-white">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>

        {mode === "delete" ? (
          <p className="mt-4">Are you sure you want to delete {activityTitle}?</p>
        ) : (
          <Input
            placeholder={config.placeholder}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="mt-4"
            disabled={loading}
          />
        )}

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            className={config.cancelClass}
            variant={config.cancelVariant}
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className={config.confirmClass}
            variant={config.confirmVariant}
            onClick={onConfirm}
            disabled={loading}
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;