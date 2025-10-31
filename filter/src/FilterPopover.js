import { useState } from "react";
import { Button, FAIcon, Popover, PopoverTrigger, PopoverContent, TooltipProvider } from "@ankamala/core";
import Filters from "./Filters";
import { countConditions } from "../utils/filterUtils";


export default function FilterPopover({ options, filterData, defaultCondition, filters, updateFilters, keysMeta }) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const filterCount = countConditions(filters);

  const togglePopover = () => setPopoverOpen(!isPopoverOpen);
  const closePopover = () => setPopoverOpen(false);

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
          options={options}
          filterData={filterData}
          defaultCondition={defaultCondition}
          filters={filters}
          updateFilters={updateFilters}
          keysMeta={keysMeta}
        />
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}
