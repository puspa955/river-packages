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

  const formattedDate =
    value instanceof Date && !isNaN(value)
      ? format(value, dateFormat)
      : "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "text-xs border-0 border-b-[1px] shadow-none p-1 justify-start text-left font-normal",
            !value && "text-slate-500",
            className 
          )}
        >
          {formattedDate || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-auto" align="start">
        <Calendar
          className={cn("bg-gray-100", calendarClassName)}
          classNames={{
            head_cell: "h-8 w-8 text-sm font-medium",
            cell: "h-8 w-8 text-slate-600",
          }}
          mode="single"
          selected={value instanceof Date && !isNaN(value) ? value : undefined}
          onSelect={(e) => onChange(e)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
