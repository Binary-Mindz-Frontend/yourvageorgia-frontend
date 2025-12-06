"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

// Helper: format date as ISO YYYY-MM-DD for backend
function formatDateISO(date: Date | undefined) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Optional: display-friendly format for input
function formatDateDisplay(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const MemberShipDate = ({
  onDateChange,
}: {
  onDateChange: (date: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [month, setMonth] = useState<Date | undefined>(date);
  const [displayValue, setDisplayValue] = useState("");

  // When user selects date from calendar
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setMonth(selectedDate);

    const isoDate = formatDateISO(selectedDate);
    const display = formatDateDisplay(selectedDate);
    setDisplayValue(display);

    onDateChange(isoDate);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="dob"
          value={displayValue}
          placeholder="Date of Birth*"
          className="pr-10"
          onChange={(e) => {
            const inputDate = new Date(e.target.value);
            setDisplayValue(e.target.value);

            if (!isNaN(inputDate.getTime())) {
              setDate(inputDate);
              setMonth(inputDate);
              onDateChange(formatDateISO(inputDate));
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5 text-white/60" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
