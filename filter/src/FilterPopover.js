import { useState } from "react";
import { Button, FAIcon, Popover, PopoverTrigger, PopoverContent, TooltipProvider } from "@ankamala/core";
import Filters from "./Filters";
import { countConditions } from "../utils/filterUtils";

export default function FilterPopover({ 
  options, 
  filterData, 
  defaultCondition, 
  filters, 
  updateFilters, 
  keysMeta,
  buttonText,
  buttonIcon = "filter",
  buttonClassName,
  buttonSize = "default", 
  badgeClassName,
  showBadge = true,
  popoverClassName,
  popoverContentClassName,
  variant = "default", 
  renderTrigger, 
}) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const filterCount = countConditions(filters);

  const togglePopover = () => setPopoverOpen(!isPopoverOpen);
  const closePopover = () => setPopoverOpen(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    default: "h-10 w-10 text-lg",
    lg: "h-12 w-12 text-xl",
  };

  const variantClasses = {
    default: "",
    outline: "border-2 border-slate-300 bg-white hover:bg-slate-50",
    ghost: "bg-transparent hover:bg-slate-100 shadow-none",
    text: "bg-transparent shadow-none hover:bg-slate-50",
  };

  const DefaultTrigger = () => (
    <Button 
      className={`
        rounded-sm shadow-lg relative
        ${buttonText ? 'w-auto px-4 gap-2' : sizeClasses[buttonSize]}
        ${variantClasses[variant]}
        ${buttonClassName || ''}
      `}
    >
      {buttonIcon && <FAIcon icon={buttonIcon} />}
      {buttonText && <span>{buttonText}</span>}
      {showBadge && filterCount > 0 && (
        <span 
          className={`
            absolute top-0 right-0 text-xs bg-primary-600 text-white 
            rounded-full w-5 h-5 flex items-center justify-center text-center 
            -mr-2 -mt-2
            ${badgeClassName || ''}
          `}
        >
          {filterCount}
        </span>
      )}
    </Button>
  );

  return (
    <Popover
      className={`z-10 ${popoverClassName || ''}`}
      style={{ zIndex: 10 }}
      open={isPopoverOpen}
      onOpenChange={togglePopover}
    >
      <PopoverTrigger asChild>
        {renderTrigger ? renderTrigger({ filterCount, isOpen: isPopoverOpen, toggle: togglePopover }) : <DefaultTrigger />}
      </PopoverTrigger>

      <PopoverContent 
        className={`
          max-w-[60vw] w-auto max-h-[70vh] overflow-y-auto 
          rounded-none bg-gray-50 border-t-2 border-t-primary-700 p-6
          ${popoverContentClassName || ''}
        `}
      >
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