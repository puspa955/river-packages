"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar, Popover, PopoverContent, PopoverTrigger, Button } from "@ankamala/core";
import { cn } from "@ankamala/core";

export function DatePicker({
  placeholder = "Enter a date",
  value,
  onChange,
  format: dateFormat = "yyyy MMM dd",
  calendarClassName,
  className, 
}) {
  const formattedDate = value ? format(value, dateFormat) : "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
  variant={"outline"}
  className={cn(
    "text-xs border-0 border-b-[1px] shadow-none p-1 justify-start text-left font-normal rounded-none",
    !value && "text-slate-500",
    className
  )}
  style={{
    borderColor: "var(--filter-input-border, #d1d5db)",
    color: value ? "var(--filter-text, #1e293b)" : "var(--filter-text-placeholder, #9ca3af)",
  }}
>
          {value ? formattedDate : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
       <Calendar
  className={cn("bg-gray-100", calendarClassName)}
  style={{ borderTopColor: "var(--filter-primary, #4f46e5)" }}
  classNames={{
    head_cell: "h-8 w-8 text-sm font-medium",
    cell: "h-8 w-8 text-slate-600",
    day_selected: "bg-[var(--filter-primary,#4f46e5)] !text-white hover:bg-[var(--filter-primary,#4f46e5)] hover:!text-white focus:bg-[var(--filter-primary,#4f46e5)] focus:!text-white",
    day_today: "text-[color:var(--filter-primary,#4f46e5)] font-medium",
  }}
  mode="single"
  selected={value}
  onSelect={(e) => onChange(e)}
  initialFocus
/>
      </PopoverContent>
    </Popover>
  );
}