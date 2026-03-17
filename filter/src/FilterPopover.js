import { useState } from "react";
import { Button, FAIcon, Popover, PopoverTrigger, PopoverContent, TooltipProvider } from "@ankamala/core";
import Filters from "./Filters";
import { countConditions } from "./utils/filterUtils";

export default function FilterPopover({
  options,
  filterData,
  defaultCondition,
  filters,
  updateFilters,
  keysMeta,
  filterProps,
}) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

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

  if (!actualProps.filterData) return null;

  return (
    <Popover
      className="z-10"
      style={{ zIndex: 10 }}
      open={isPopoverOpen}
      onOpenChange={togglePopover}
    >
      <PopoverTrigger asChild>
        <Button
          className="rounded-sm h-10 w-10 text-lg shadow-lg relative"
          style={{
            background: "var(--filter-primary, #4f46e5)",
            color: "var(--filter-primary-text, #ffffff)",
            borderRadius: "var(--filter-radius, 2px)",
          }}
        >
          <FAIcon icon="filter" />
          {filterCount > 0 && (
            <span
              className="absolute top-0 right-0 rounded-full w-5 h-5 flex items-center justify-center -mr-2 -mt-2"
              style={{
                fontSize: 10,
                background: "var(--filter-badge-bg, #4f46e5)",
                color: "var(--filter-badge-text, #ffffff)",
              }}
            >
              {filterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="max-w-[60vw] w-auto max-h-[70vh] overflow-y-auto rounded-none p-6"
        style={{
          background: "var(--filter-bg, #f9fafb)",
          borderTop: "2px solid var(--filter-border-top, #4f46e5)",
        }}
      >
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