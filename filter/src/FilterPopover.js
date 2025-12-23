import { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  TooltipProvider
} from "@ankamala/core";
import Filters from "./Filters";
import { countConditions } from "../utils/filterUtils";
import { FAIcon } from "@ankamala/core";

export default function FilterPopover({
  options,
  filterData,
  defaultCondition,
  filters,
  updateFilters,
  keysMeta,

  trigger,
  triggerIcon,
  triggerLabel,
  renderCount,
  triggerClassName = "",
  contentClassName = "",

  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnApply = true
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  const filterCount = countConditions(filters);
  const closePopover = () => setOpen(false);

  const showIcon = !!triggerIcon;
  const showLabel = !!triggerLabel;

  const defaultTrigger = (
    <Button
      className={`flex items-center gap-2 rounded-sm h-10 relative ${triggerClassName}`}
    >
      {/* Icon */}
      {showIcon && (
        <span className="inline-flex items-center">
          {triggerIcon}
        </span>
      )}

      {/* Label */}
      {showLabel && (
        <span className="text-sm font-medium">
          {triggerLabel}
        </span>
      )}

      {/* Fallback if nothing provided */}
      {!showIcon && !showLabel && (
        <FAIcon icon="filter" />
      )}

      {/* Count badge */}
      {filterCount > 0 && (
        renderCount
          ? renderCount(filterCount)
          : (
            <span className="absolute -top-2 -right-2 text-xs bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {filterCount}
            </span>
          )
      )}
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? defaultTrigger}
      </PopoverTrigger>

      <PopoverContent
        className={`max-w-[60vw] max-h-[70vh] overflow-y-auto p-6 ${contentClassName}`}
      >
        <TooltipProvider>
          <Filters
            options={options}
            filterData={filterData}
            defaultCondition={defaultCondition}
            filters={filters}
            updateFilters={updateFilters}
            keysMeta={keysMeta}
            closePopover={closeOnApply ? closePopover : undefined}
          />
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}
