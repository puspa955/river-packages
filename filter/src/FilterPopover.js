import { useState } from "react";
import { Button, FAIcon, Popover, PopoverTrigger, PopoverContent, TooltipProvider } from "@ankamala/core";
import Filters from "./Filters";
import { countConditions } from "../utils/filterUtils";

export default function FilterPopover({ 
  // Option 1: Pass everything manually (legacy support)
  options, 
  filterData, 
  defaultCondition, 
  filters, 
  updateFilters, 
  keysMeta,
  // Option 2: Pass filterProps from useFilter hook (new way)
  filterProps,
}) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  // Use filterProps if provided, otherwise fall back to individual props
  // ✅ FIX: Ensure all props are properly extracted
  const actualProps = filterProps ? filterProps : {
    options: options || {},
    filterData,
    defaultCondition,
    filters,
    updateFilters,
    keysMeta,
  };

  const filterCount = countConditions(actualProps.filters);

  const togglePopover = () => setPopoverOpen(!isPopoverOpen);
  const closePopover = () => setPopoverOpen(false);

  // Don't render if no filterData
  if (!actualProps.filterData) return null;

  return (
    <Popover
      className="z-10"
      style={{ zIndex: 10 }}
      open={isPopoverOpen}
      onOpenChange={togglePopover}
    >
      <PopoverTrigger asChild>
        <Button className="rounded-sm h-10 w-10 text-lg shadow-lg relative">
          <FAIcon icon="filter" />
          {filterCount > 0 && (
            <span className="absolute top-0 right-0 text-xs bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-center -mr-2 -mt-2">
              {filterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="max-w-[60vw] w-auto max-h-[70vh] overflow-y-auto rounded-none bg-gray-50 border-t-2 border-t-primary-700 p-6">
        <TooltipProvider>
          <Filters 
            closePopover={closePopover}
            options={actualProps.options}
            filterData={actualProps.filterData}
            defaultCondition={actualProps.defaultCondition}
            filters={actualProps.filters}
            updateFilters={actualProps.updateFilters}
            keysMeta={actualProps.keysMeta}
          />
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}