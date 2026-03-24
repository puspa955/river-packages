import { useCallback, useMemo, useState } from "react";
import { SearchIcon, XIcon } from "./Icon";
import { FilterSection } from "./FilterSection";

/* ─────────────────────────────────────────
   CheckboxItem
───────────────────────────────────────── */
export const CheckboxItem = ({ checked, onChange, label }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        cursor: "pointer",
        padding: "3px 0",
        width: "fit-content",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          marginTop: 2,
          width: 14,
          height: 14,
          cursor: "pointer",
          flexShrink: 0,
          accentColor: "var(--dsf-primary, #3b6fd4)",
        }}
      />
      <span style={{
        fontSize: 13,
        color: hovered
          ? "var(--dsf-primary, #3b6fd4)"
          : "var(--dsf-text-primary, #0f1923)",
        fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
        transition: "color 0.15s",
        lineHeight: 1.4,
        userSelect: "none",
      }}>
        {label}
      </span>
    </label>
  );
};

/* ─────────────────────────────────────────
   CheckboxGroupFilter
───────────────────────────────────────── */
export const CheckboxGroupFilter = ({ config = {}, value = [], onChange, isNested = false }) => {
  const [showAll, setShowAll] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const toggleOption = useCallback((option) => {
    const next = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(next.length ? next : undefined);
  }, [value, onChange]);

  if (!config.options || config.options.length === 0) return null;

  const MAX_VISIBLE = 5;
  const visible = showAll ? config.options : config.options.slice(0, MAX_VISIBLE);

  return (
    <FilterSection label={config.label} isNested={isNested}>
      {visible.map(option => (
        <CheckboxItem
          key={option}
          label={option}
          checked={value?.includes(option) || false}
          onChange={() => toggleOption(option)}
        />
      ))}

      {config.options.length > MAX_VISIBLE && (
        <button
          onClick={() => setShowAll(v => !v)}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            all: "unset",
            marginTop: 4,
            fontSize: 12,
            color: btnHovered
              ? "var(--dsf-primary-hover, #2d5bbf)"
              : "var(--dsf-primary, #3b6fd4)",
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
            transition: "color 0.15s",
          }}
        >
          {showAll ? "See less" : `See all (${config.options.length})`}
        </button>
      )}
    </FilterSection>
  );
};

/* ─────────────────────────────────────────
   RangeFilter
───────────────────────────────────────── */
export const RangeFilter = ({ config, value = [], onChange, isNested = false }) => {
  const toggleRange = useCallback((label) => {
    const next = value.includes(label)
      ? value.filter(v => v !== label)
      : [...value, label];
    onChange(next.length ? next : undefined);
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

/* ─────────────────────────────────────────
   CheckboxFilter  (standalone boolean)
───────────────────────────────────────── */
export const CheckboxFilter = ({ config, value = false, onChange }) => (
  <div style={{ padding: "2px 0" }}>
    <CheckboxItem
      checked={!!value}
      onChange={e => onChange(e.target.checked ? true : undefined)}
      label={config.label}
    />
  </div>
);

/* ─────────────────────────────────────────
   NestedGroupFilter
───────────────────────────────────────── */
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
              onChange={val => onFilterChange(childKey, val)}
              isNested
            />
          );
        }

        if (childConfig.type === "range") {
          return (
            <RangeFilter
              key={childKey}
              config={childConfig}
              value={filters[childKey]}
              onChange={val => onFilterChange(childKey, val)}
              isNested
            />
          );
        }

        return null;
      })}
    </FilterSection>
  );
};

/* ─────────────────────────────────────────
   FilterBadges
───────────────────────────────────────── */
export const FilterBadges = ({ schema, filters, onRemove }) => {
  const badges = useMemo(() => {
    const result = [];
    const extract = (schemaObj) => {
      Object.entries(schemaObj).forEach(([key, config]) => {
        if (config.type === "group" && config.childrenSchema) {
          extract(config.childrenSchema);
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
    extract(schema);
    return result;
  }, [schema, filters]);

  if (!badges.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
      {badges.map(badge => (
        <BadgeItem key={`${badge.key}-${badge.value || ""}`} badge={badge} onRemove={onRemove} />
      ))}
    </div>
  );
};

const BadgeItem = ({ badge, onRemove }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 6px 3px 10px",
      background: "var(--dsf-badge-bg, #eff4ff)",
      color: "var(--dsf-badge-text, #1e3fa8)",
      border: "1px solid var(--dsf-badge-border, #c0d0f5)",
      borderRadius: "var(--dsf-radius, 5px)",
      fontSize: 12,
      fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      fontWeight: 500,
    }}>
      <span>{badge.label}</span>
      <button
        onClick={() => onRemove(badge)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Remove ${badge.label}`}
        style={{
          all: "unset",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          borderRadius: "50%",
          cursor: "pointer",
          color: hovered
            ? "var(--dsf-primary, #3b6fd4)"
            : "var(--dsf-badge-text, #1e3fa8)",
          transition: "color 0.15s",
        }}
      >
        <XIcon size={11} />
      </button>
    </span>
  );
};

/* ─────────────────────────────────────────
   SearchHeader
───────────────────────────────────────── */
export const SearchHeader = ({ schema, filters, onFilterChange }) => {
  const [focused, setFocused] = useState(false);

  const searchEntry = Object.entries(schema).find(([, c]) => c.type === "search");
  if (!searchEntry) return null;

  const [searchKey, searchSchema] = searchEntry;
  const searchValue = filters[searchKey] || "";

  const removeBadge = (badge) => {
    if (badge.type === "search") onFilterChange(badge.key, "");
    else if (badge.type === "array") {
      const next = (filters[badge.key] || []).filter(v => v !== badge.value);
      onFilterChange(badge.key, next.length ? next : undefined);
    } else if (badge.type === "checkbox") {
      onFilterChange(badge.key, undefined);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ position: "relative" }}>
        {/* search icon */}
        <span style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: focused
            ? "var(--dsf-primary, #3b6fd4)"
            : "var(--dsf-text-muted, #8e99a4)",
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
          transition: "color 0.15s",
        }}>
          <SearchIcon size={15} />
        </span>

        <input
          type="text"
          placeholder={searchSchema.placeholder || "Search…"}
          value={searchValue}
          onChange={e => onFilterChange(searchKey, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            paddingLeft: 34,
            paddingRight: searchValue ? 34 : 12,
            paddingTop: 9,
            paddingBottom: 9,
            border: focused
              ? "1px solid var(--dsf-border-focus, #3b6fd4)"
              : "1px solid var(--dsf-border, #e2e5ea)",
            boxShadow: focused
              ? "0 0 0 3px var(--dsf-primary-light, #eff4ff)"
              : "none",
            borderRadius: "var(--dsf-radius, 5px)",
            fontSize: 13,
            fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
            color: "var(--dsf-text-primary, #0f1923)",
            background: "#ffffff",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
        />

        {searchValue && (
          <ClearButton onClick={() => onFilterChange(searchKey, "")} />
        )}
      </div>

      <FilterBadges schema={schema} filters={filters} onRemove={removeBadge} />
    </div>
  );
};

const ClearButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Clear search"
      style={{
        all: "unset",
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: hovered
          ? "var(--dsf-text-secondary, #52616b)"
          : "var(--dsf-text-muted, #8e99a4)",
        transition: "color 0.15s",
      }}
    >
      <XIcon size={14} />
    </button>
  );
};