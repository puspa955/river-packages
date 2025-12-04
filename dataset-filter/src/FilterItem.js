import { useCallback, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { FilterSection } from './FilterSection';

export const CheckboxItem = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer group w-fit">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 rounded-sm border-gray-300 accent-primary-600 focus:ring-primary-500 cursor-pointer transition-colors group-hover:border-primary-600"
      />
      <span className="text-sm text-gray-900 font-light group-hover:text-primary-600 transition-colors">
        {label}
      </span>
    </label>
  );
};

export const CheckboxGroupFilter = ({ config = {}, value = [], onChange, isNested = false }) => {
  const [showAll, setShowAll] = useState(false);
  
  const toggleOption = useCallback((option) => {
    const newValue = value.includes(option) ? value.filter(v => v !== option) : [...value, option];
    onChange(newValue.length ? newValue : undefined);
  }, [value, onChange]);

  if (!config.options || config.options.length === 0) return null;

  const MAX_VISIBLE = 5;
  const visibleOptions = showAll ? config.options : config.options.slice(0, MAX_VISIBLE);

  return (
    <FilterSection label={config.label} isNested={isNested}>
      {visibleOptions.map(option => (
        <CheckboxItem
          key={option}
          label={option}
          checked={value?.includes(option) || false}
          onChange={() => toggleOption(option)}
        />
      ))}

      {config.options.length > MAX_VISIBLE && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-primary-600 hover:text-primary-500 text-xs inline-flex items-center gap-1 underline"
        >
          {showAll ? 'See less' : 'See all'}
        </button>
      )}
    </FilterSection>
  );
};


export const RangeFilter = ({ config, value = [], onChange, isNested = false }) => {
  const toggleRange = useCallback((label) => {
    const newValue = value.includes(label) ? value.filter(v => v !== label) : [...value, label];
    onChange(newValue.length ? newValue : undefined);
  }, [value, onChange]);

  if (!config.ranges?.length) return null;

  return (
    <FilterSection label={config.label} isNested={isNested}>
      {config.ranges.map(range => (
        <CheckboxItem
          key={range.label}
          label={range.label}
          checked={value?.includes(range.label) || false}
          onChange={() => toggleRange(range.label)}
        />
      ))}
    </FilterSection>
  );
};

export const CheckboxFilter = ({ config, value = false, onChange }) => {
  return (
    <div>
      <CheckboxItem
        checked={!!value}
        onChange={(e) => onChange(e.target.checked ? true : undefined)}
        label={config.label}
      />
    </div>
  );
};

export const NestedGroupFilter = ({ config, filters, onFilterChange, defaultExpanded = true }) => {
  if (!config.children || config.children.length === 0) return null;

  return (
    <FilterSection label={config.label} defaultExpanded={defaultExpanded}>
      {config.children.map(childKey => {
        const childConfig = config.childrenSchema[childKey];
        if (!childConfig) return null;

        if (childConfig.type === "checkbox-group") {
          return (
            <CheckboxGroupFilter
              key={childKey}
              config={childConfig}
              value={filters[childKey]}
              onChange={(val) => onFilterChange(childKey, val)}
              isNested={true}
            />
          );
        }

        if (childConfig.type === "range") {
          return (
            <RangeFilter
              key={childKey}
              config={childConfig}
              value={filters[childKey]}
              onChange={(val) => onFilterChange(childKey, val)}
              isNested={true}
            />
          );
        }

        return null;
      })}
    </FilterSection>
  );
};

export const FilterBadges = ({ schema, filters, onRemove }) => {
  const badges = useMemo(() => {
    const result = [];

    const extractBadges = (schemaObj) => {
      Object.entries(schemaObj).forEach(([key, config]) => {
        if (config.type === "group" && config.childrenSchema) {
          extractBadges(config.childrenSchema);
          return;
        }

        const value = filters[key];
        if (!value) return;

        if (config.type === "search") {
          result.push({ key, label: value, type: "search" });
        } else if (config.type === "checkbox" && value === true) {
          result.push({ key, label: config.label, type: "checkbox" });
        } else if (Array.isArray(value) && value.length > 0) {
          value.forEach(val => result.push({ key, label: val, type: "array", value: val }));
        }
      });
    };

    extractBadges(schema);
    return result;
  }, [schema, filters]);

  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {badges.map(badge => (
        <span key={`${badge.key}-${badge.value || ''}`} className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-100/80 text-gray-700 text-sm border">
          <span>{badge.label}</span>
          <button onClick={() => onRemove(badge)} className="hover:text-primary-600 rounded-full p-0.5 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
};

export const SearchHeader = ({ schema, filters, onFilterChange }) => {
  const searchConfigEntry = Object.entries(schema).find(([_, c]) => c.type === "search");
  if (!searchConfigEntry) return null;

  const [searchKey, searchSchema] = searchConfigEntry;
  const searchValue = filters[searchKey] || "";

  const removeBadge = (badge) => {
    if (badge.type === "search") onFilterChange(badge.key, "");
    else if (badge.type === "array") {
      const newValues = (filters[badge.key] || []).filter(v => v !== badge.value);
      onFilterChange(badge.key, newValues.length ? newValues : undefined);
    } else if (badge.type === "checkbox") {
      onFilterChange(badge.key, undefined);
    }
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={searchSchema.placeholder}
          value={searchValue}
          onChange={(e) => onFilterChange(searchKey, e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-400/70 focus:ring-1 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
        />
        {searchValue && (
          <button onClick={() => onFilterChange(searchKey, "")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <FilterBadges schema={schema} filters={filters} onRemove={removeBadge} />
    </div>
  );
};