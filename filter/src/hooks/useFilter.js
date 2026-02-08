import { useState, useMemo } from "react";
import { filter as applyFilterFn } from "../utils/filterUtils";


export function useFilter(data = [], config = null) {
  const [filters, setFilters] = useState(null);

  /* ---------------- METADATA ---------------- */
  const metadata = useMemo(() => {
    if (!config?.fields) {
      return {
        fieldMeta: null,
        keysMeta: {},
        filterData: null,
        defaultCondition: null,
      };
    }

    const { fields } = config;

    // For applyFilterFn
    const fieldMeta = {
      all: {
        map: fields.reduce((acc, field) => {
          acc[field.path] = {
            label: field.label,
            type: field.type || "string",
          };
          return acc;
        }, {}),
      },
    };

    // For FilterPopover key selector
    const keysMeta = fields.reduce((acc, field) => {
      acc[field.path] = {
        label: field.label,
        type: field.type || "string",
        multiple: field.multiple ?? false,
      };
      return acc;
    }, {});

    // For FilterPopover type system
    const filterData = {
      types: fields.reduce((acc, field) => {
        acc[field.path] = field.type || "string";
        return acc;
      }, {}),
      fields,
    };

    // Default condition
    const defaultCondition = config.defaultCondition
      ? {
          id: config.defaultCondition.key,
          key: config.defaultCondition.key,
          label:
            keysMeta[config.defaultCondition.key]?.label ||
            config.defaultCondition.key,
          operator: config.defaultCondition.operator,
          value: config.defaultCondition.value,
          type:
            keysMeta[config.defaultCondition.key]?.type || "string",
          isGroup: false,
        }
      : null;

    return { fieldMeta, keysMeta, filterData, defaultCondition };
  }, [config]);

  /* ---------------- SELECT OPTIONS (FIX) ---------------- */
  const options = useMemo(() => {
    if (!config) return {};

    const result = {};
    Object.keys(config).forEach((key) => {
      if (Array.isArray(config[key])) {
        result[key] = config[key];
      }
    });

    return result;
  }, [config]);

  /* ---------------- APPLY FILTERS ---------------- */
  const filteredData = useMemo(() => {
    if (!filters || !metadata.fieldMeta) return data;
    return applyFilterFn(data, filters, null, metadata.fieldMeta);
  }, [data, filters, metadata.fieldMeta]);

  /* ---------------- HELPERS ---------------- */
  const hasActiveFilters = useMemo(() => {
    if (!filters) return false;
    if (Array.isArray(filters)) return filters.length > 0;
    if (filters.rules) return filters.rules.length > 0;
    return false;
  }, [filters]);

  const clearFilters = () => setFilters(null);

  /* ---------------- FILTER POPOVER PROPS ---------------- */
  const filterProps = metadata.filterData
    ? {
        filterData: metadata.filterData,
        defaultCondition: metadata.defaultCondition,
        filters,
        updateFilters: setFilters,
        keysMeta: metadata.keysMeta,
        options, // ✅ CRITICAL FIX
      }
    : null;

  return {
    filteredData,
    filters,
    setFilters,
    filterProps,
    clearFilters,
    hasActiveFilters,
    filterCount: hasActiveFilters
      ? Array.isArray(filters)
        ? filters.length
        : filters.rules?.length || 0
      : 0,
  };
}
