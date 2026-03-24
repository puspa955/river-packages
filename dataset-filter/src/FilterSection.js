import { useState } from "react";
import { ChevronDownIcon } from "./Icon";

export const FilterSection = ({ label, isNested = false, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={isNested ? {} : {
      borderBottom: "1px solid var(--dsf-border, #e2e5ea)",
      paddingBottom: 4,
      marginBottom: 4,
    }}>
      <button
        onClick={() => setIsExpanded(v => !v)}
        aria-expanded={isExpanded}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
          fontWeight: isNested ? 600 : 700,
          letterSpacing: isNested ? "0.05em" : "0.08em",
          textTransform: "uppercase",
          color: isNested
            ? "var(--dsf-text-muted, #8e99a4)"
            : "var(--dsf-text-secondary, #52616b)",
          fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
        }}>
          {label}
        </span>

        <ChevronDownIcon
          size={14}
          style={{
            color: hovered
              ? "var(--dsf-primary, #3b6fd4)"
              : "var(--dsf-text-muted, #8e99a4)",
            flexShrink: 0,
            transition: "transform 0.2s ease, color 0.15s",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isExpanded && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          paddingBottom: 8,
        }}>
          {children}
        </div>
      )}
    </div>
  );
};