import React, { forwardRef } from "react";
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome"

/**
 * Combine class names safely with Tailwind merging
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Spinner component using Font Awesome
 * 
 * Usage:
 * <Spinner className="w-5 h-5 text-gray-500" />
 */
export const Spinner = ({ className }) => (
  <FAIcon icon="spinner" className={cn("animate-spin text-primary-600", className)} />
)

export const SelectTrigger = forwardRef(
  ({ selected, leftIcon, rightIcon, className, iconClassName, placeholder, maxWidth = "max-w-20", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center border-b pb-1 px-2 text-gray-500 text-sm font-light cursor-pointer min-w-0 overflow-hidden",
          className
        )}
        {...props} 
      >
        <div className="flex text-start items-center justify-center truncate min-w-0">
          {leftIcon && (
            <FAIcon
              icon={leftIcon}
              className={cn("h-3 w-3 text-secondary-500 flex-shrink-0", iconClassName)}
            />
          )}
          <span className={`truncate min-w-0 ${maxWidth} ${leftIcon ? "pl-1" : ""}`}>
            {selected && selected.length
              ? Array.isArray(selected)
                ? `${selected.length} selected`
                : selected.label
              : placeholder}
          </span>
        </div>

        {rightIcon && (
          <FAIcon icon={rightIcon} className="h-3 w-3 pl-1 flex-shrink-0" />
        )}
      </button>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

export const renderSelectTrigger = (selected, leftIcon, rightIcon, className, iconClassName, placeholder) => {
  return (
    <SelectTrigger
      selected={selected}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      className={className}
      iconClassName={iconClassName}
      placeholder={placeholder}
      maxWidth="flex-1"
    />
  );
};
