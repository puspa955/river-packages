import { useState } from "react";
import { SlidersIcon, ChevronDownIcon } from "./icons";
import { CheckboxFilter, CheckboxGroupFilter, NestedGroupFilter, RangeFilter } from "./FilterItem";

export const FilterPanel = ({ schema, filters, onFilterChange }) => {
  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [generalHovered, setGeneralHovered] = useState(false);

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
          onChange={value => onFilterChange(key, value)}
        />
      );
    }

    if (config.type === "range") {
      return (
        <RangeFilter
          key={key}
          config={config}
          value={filters[key]}
          onChange={value => onFilterChange(key, value)}
        />
      );
    }

    return null;
  };

  const standaloneCheckboxes = Object.entries(schema).filter(
    ([, config]) => config.type === "checkbox"
  );

  return (
    <aside style={{
      width: "var(--dsf-panel-width, 272px)",
      minWidth: "var(--dsf-panel-width, 272px)",
      background: "var(--dsf-bg-panel, #ffffff)",
      borderRight: "1px solid var(--dsf-border, #e2e5ea)",
      height: "100vh",
      overflowY: "auto",
      padding: "20px 16px",
      position: "sticky",
      top: 0,
      boxSizing: "border-box",
      fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
    }}
      className="dsf-panel"
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: "1px solid var(--dsf-border, #e2e5ea)",
      }}>
        <span style={{ color: "var(--dsf-primary, #3b6fd4)", display: "flex" }}>
          <SlidersIcon size={16} />
        </span>
        <h2 style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 700,
          color: "var(--dsf-text-primary, #0f1923)",
          letterSpacing: "-0.01em",
          fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
        }}>
          Filters
        </h2>
      </div>

      {/* General group for standalone checkboxes */}
      {standaloneCheckboxes.length > 0 && (
        <div style={{
          borderBottom: "1px solid var(--dsf-border, #e2e5ea)",
          marginBottom: 4,
        }}>
          <button
            onClick={() => setGeneralExpanded(v => !v)}
            onMouseEnter={() => setGeneralHovered(true)}
            onMouseLeave={() => setGeneralHovered(false)}
            aria-expanded={generalExpanded}
            style={{
              all: "unset",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "8px 0",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--dsf-text-secondary, #52616b)",
              fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
            }}>
              General
            </span>
            <ChevronDownIcon
              size={14}
              style={{
                color: generalHovered
                  ? "var(--dsf-primary, #3b6fd4)"
                  : "var(--dsf-text-muted, #8e99a4)",
                transition: "transform 0.2s ease, color 0.15s",
                transform: generalExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {generalExpanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 1, paddingBottom: 8 }}>
              {standaloneCheckboxes.map(([key, config]) => (
                <CheckboxFilter
                  key={key}
                  config={config}
                  value={filters[key]}
                  onChange={val => onFilterChange(key, val)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* All other filters */}
      {Object.entries(schema).map(([key, config]) => renderFilter(key, config))}
    </aside>
  );
};