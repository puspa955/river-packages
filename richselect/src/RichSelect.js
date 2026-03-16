"use client"

import { useState } from "react"; 
import { Popover, PopoverTrigger, PopoverContent } from "@ankamala/core";
import {
  CommandLibrary,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandInput,
  CommandEmpty,
} from "@ankamala/core";
import { cn, Spinner } from "@ankamala/core";
import { FAIcon } from "@ankamala/core";
import { Tooltip, TooltipProvider } from "@ankamala/core";

const getOptionValue = (option) => (typeof option === "object" ? option.path : option);

const SelectedOptionsDisplay = ({ selected, onRemove, onClearAll }) => {
    const sortedSelected = selected.slice().sort((a, b) => {
        const labelA = typeof a === "object" ? a.label : a;
        const labelB = typeof b === "object" ? b.label : b;
        return labelA.localeCompare(labelB);
    });

    return (
        <div className="sticky top-0 z-10 border-b w-0 min-w-full"
            style={{ backgroundColor: 'var(--rs-bg, #ffffff)', borderColor: 'var(--rs-border, #f3f4f6)' }}>
            <div className="relative px-4 pt-2 pb-4 pr-8">
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto overflow-x-hidden">
                    {sortedSelected.map((option) => (
                        <span
                            key={getOptionValue(option)}
                            onClick={(e) => { e.stopPropagation(); onRemove(option); }}
                            className="flex items-center text-[10px] px-1 py-0.5 rounded-sm cursor-pointer transition flex-shrink-0"
                            style={{
                                backgroundColor: 'var(--rs-tag-bg, #eef2ff)',
                                color: 'var(--rs-tag-text, #6366f1)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--rs-accent-hover, #e0e7ff)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--rs-tag-bg, #eef2ff)'}
                        >
                            <span className="truncate max-w-[120px]">
                                {typeof option === "object" ? option.label : option}
                            </span>
                            <FAIcon icon="close" className="h-2 w-2 ml-1 flex-shrink-0"
                                style={{ color: 'var(--rs-accent, #6366f1)' }} />
                        </span>
                    ))}
                </div>
                <div
                    onClick={(e) => { e.stopPropagation(); onClearAll(); }}
                    className="absolute top-1 right-2 cursor-pointer"
                >
                    <Tooltip
                        tooltipText="Clear all"
                        icon="close"
                        className="h-4 w-4 mr-1 transition"
                        style={{ color: 'var(--rs-text-muted, #6b7280)' }}
                    />
                </div>
            </div>
        </div>
    );
};

const RecursiveOptions = ({ options, selected, onOptionSelect, className, multiple, isSmall, optionTooltip }) => {
    const sortedOptions = options.slice().sort((a, b) => {
        const labelA = a.label?.toLowerCase() ?? "";
        const labelB = b.label?.toLowerCase() ?? "";
        return labelA.localeCompare(labelB);
    });

    return (
        <div className={cn(className)}>
            {sortedOptions.map((option, index) => {
                if (option.isLoading) {
                    return (
                        <CommandItem
                            key="loading-state"
                            value={option.label}
                            className="px-4 py-2 cursor-default"
                            style={{ color: 'var(--rs-text-muted, #6b7280)' }}
                            disabled
                        >
                            <div className="flex items-center gap-2">
                                <Spinner className="w-4 h-4" />
                                <span>{option.label}</span>
                            </div>
                        </CommandItem>
                    );
                }

                const isSelected = multiple || isSmall
                    ? selected.some((item) => getOptionValue(item) === getOptionValue(option))
                    : selected && getOptionValue(selected) === getOptionValue(option);

                if (option.options) {
                    return (
                        <CommandGroup
                            className="px-2 mt-2 overflow-visible"
                            key={index}
                            heading={
                                <span
                                    className="cursor-default font-bold text-sm whitespace-nowrap"
                                    style={{ color: 'var(--rs-text, #111827)' }}
                                >
                                    {option.label}
                                </span>
                            }
                        >
                            <RecursiveOptions
                                options={option.options}
                                selected={selected}
                                onOptionSelect={onOptionSelect}
                                multiple={multiple}
                                isSmall={isSmall}
                                optionTooltip={optionTooltip}
                            />
                        </CommandGroup>
                    );
                }

                const content = (
                    <CommandItem
                        key={index}
                        value={option.label}
                        className="px-4 py-2 cursor-pointer font-light border-b whitespace-nowrap transition-colors"
                        style={{
                            borderColor:     'var(--rs-border, #f3f4f6)',
                            backgroundColor: isSelected ? 'var(--rs-selected-bg, #eef2ff)' : undefined,
                            color:           'var(--rs-text, #111827)',
                        }}
                        onMouseEnter={e => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--rs-bg-hover, #f9fafb)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = isSelected ? 'var(--rs-selected-bg, #eef2ff)' : '';
                        }}
                        onSelect={() => onOptionSelect(option)}
                    >
                        <div className="flex justify-between items-center w-full gap-2">
                            <span className="whitespace-nowrap">{option.label}</span>
                            {isSelected && (
                                <FAIcon icon="check" className="h-3 w-3 ml-2 flex-shrink-0"
                                    style={{ color: 'var(--rs-check-color, #6366f1)' }} />
                            )}
                        </div>
                    </CommandItem>
                );

                if (optionTooltip) {
                    const tooltipText = typeof optionTooltip === "function"
                        ? optionTooltip(option)
                        : optionTooltip?.[option.path];
                    return tooltipText ? (
                        <Tooltip key={index} tooltipText={tooltipText} side="right">{content}</Tooltip>
                    ) : content;
                }

                return content;
            })}
        </div>
    );
};

const RichSelect = ({
    options,
    selected = [],
    onSelect,
    trigger,
    children,
    className,
    multiple = false,
    isSearchable = true,
    isSmall = false,
    isShadow = true,
    showSelectedSummary = true,
    onSearchChange,
    searchPlaceholder = "Search...",
    shouldFilter = true,
    optionTooltip,
    searchFields = ['label'],
}) => {
    const [openMain, setOpenMain] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const flattenOptions = (opts) => {
        const flattened = [];
        const traverse = (items) => {
            items.forEach(item => {
                if (item.options) traverse(item.options);
                else if (!item.isLoading) flattened.push(item);
            });
        };
        traverse(opts);
        return flattened;
    };

    const filterOptions = (opts, search) => {
        if (!search) return opts;
        const searchLower = search.toLowerCase();
        const flatMatches = flattenOptions(opts).filter(opt =>
            searchFields.some(field => opt[field]?.toLowerCase().includes(searchLower))
        );
        const matchPaths = new Set(flatMatches.map(opt => opt.path));

        const filterRecursive = (items) =>
            items.map(item => {
                if (item.options) {
                    const groupMatches = item.label.toLowerCase().includes(searchLower);
                    if (groupMatches) return { ...item, matchedGroup: true };
                    const filteredChildren = filterRecursive(item.options);
                    if (filteredChildren.length > 0) return { ...item, options: filteredChildren };
                    return null;
                } else if (item.isLoading || matchPaths.has(item.path)) return item;
                return null;
            }).filter(Boolean);

        return filterRecursive(opts);
    };

    const filteredOptions = shouldFilter ? filterOptions(options, searchValue) : options;

    const handleOptionSelect = (option) => {
        if (multiple) {
            const isSelected = selected.some((item) => getOptionValue(item) === getOptionValue(option));
            const newSelected = isSelected
                ? selected.filter((item) => getOptionValue(item) !== getOptionValue(option))
                : [...selected, option];
            onSelect(newSelected);
        } else {
            onSelect(option);
            setOpenMain(false);
        }
    };

    const handleSearchChange = (value) => {
        setSearchValue(value);
        if (onSearchChange) onSearchChange(value);
    };

    return (
        <div className={cn("relative flex rich-select-root", className)}>
            <Popover open={openMain} onOpenChange={setOpenMain}>
                <PopoverTrigger
                    asChild
                    className={`flex items-center gap-1 text-sm ${isSmall ? "border-none px-1 text-xs py-0" : "border-b px-2 py-1"}`}
                    style={{
                        color: 'var(--rs-text-muted, #6b7280)',
                        borderColor: 'var(--rs-border, #f3f4f6)',
                    }}
                >
                    {children ? children : trigger(selected)}
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    sideOffset={4}
                    className={cn("border w-auto", !isShadow && "shadow-none")}
                    style={{
                        backgroundColor: 'var(--rs-bg, #ffffff)',
                        borderColor: 'var(--rs-border, #f3f4f6)',
                    }}
                >
                    <TooltipProvider>
                        <CommandLibrary shouldFilter={false}>
                            {isSearchable && (
                                <CommandInput
                                    placeholder={searchPlaceholder}
                                    className="px-4 py-2 mb-2 border-b focus:outline-none focus:ring-0"
                                    style={{
                                        borderColor: 'var(--rs-border, #f3f4f6)',
                                        color: 'var(--rs-text, #111827)',
                                    }}
                                    onValueChange={handleSearchChange}
                                />
                            )}
                            <CommandList>
                                {multiple && selected.length > 0 &&
                                    (showSelectedSummary === "always" || (showSelectedSummary !== false && options.length > 6)) && (
                                        <SelectedOptionsDisplay
                                            selected={selected}
                                            onRemove={handleOptionSelect}
                                            onClearAll={() => onSelect([])}
                                        />
                                    )}
                                <RecursiveOptions
                                    options={filteredOptions}
                                    selected={selected}
                                    onOptionSelect={handleOptionSelect}
                                    multiple={multiple}
                                    isSmall={isSmall}
                                    optionTooltip={optionTooltip}
                                />
                                {filteredOptions.length === 0 && <CommandEmpty />}
                            </CommandList>
                        </CommandLibrary>
                    </TooltipProvider>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default RichSelect;