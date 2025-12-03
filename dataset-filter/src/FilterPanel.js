import React from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { CheckboxFilter, CheckboxGroupFilter, NestedGroupFilter, RangeFilter } from "./FilterItem";

export const FilterPanel = ({ schema, filters, onFilterChange }) => {
  const [generalExpanded, setGeneralExpanded] = React.useState(true);

  const renderFilter = (key, config) => {
    if (config.type === "search") return null;

    if (config.type === "group") {
      return (
        <NestedGroupFilter
          key={key}
          config={config}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      );
    }

    if (config.type === "checkbox-group") {
      return (
        <CheckboxGroupFilter
          key={key}
          config={config}
          value={filters[key]}
          onChange={(value) => onFilterChange(key, value)}
        />
      );
    }

    if (config.type === "range") {
      return (
        <RangeFilter
          key={key}
          config={config}
          value={filters[key]}
          onChange={(value) => onFilterChange(key, value)}
        />
      );
    }

    return null;
  };

  // Standalone checkboxes (type === "checkbox")
  const standaloneCheckboxes = Object.entries(schema).filter(
    ([, config]) => config.type === "checkbox"
  );

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto p-6 sticky top-0 custom-scroll">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Filters</h2>
      </div>

      {/* General group for standalone checkboxes */}
      {standaloneCheckboxes.length > 0 && (
        <div className="pb-3 mb-3 border-b border-gray-200">
          <button
            onClick={() => setGeneralExpanded(!generalExpanded)}
            className="w-full flex items-center justify-between group"
          >
            <h3 className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
              General
            </h3>
            <ChevronDown 
              className={`w-5 h-5 text-gray-600 hover:text-primary-600 transition-transform ${generalExpanded ? 'rotate-180' : ''}`} 
            />
          </button>

          {generalExpanded && (
            <div className="space-y-0.5 mt-2">
              {standaloneCheckboxes.map(([key, config]) => (
                <CheckboxFilter
                  key={key}
                  config={config}
                  value={filters[key]}
                  onChange={(val) => onFilterChange(key, val)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* All other filters */}
      {Object.entries(schema).map(([key, config]) => renderFilter(key, config))}
    </div>
  );
};
