import { useState, useMemo } from 'react';
import { filter as applyFilterFn } from '../utils/filterUtils';

/**
 * A hook that handles all filter logic internally
 * @param {Array} data - The data to filter
 * @param {Object} config - Filter configuration
 * @param {Array} config.fields - Array of {label, path, type}
 * @param {Object} config.defaultCondition - Optional {key, operator, value}
 * @returns {Object} - {filteredData, filters, setFilters, filterProps, clearFilters, hasActiveFilters}
 */
export function useFilter(data = [], config = null) {
  const [filters, setFilters] = useState(null);

  // Build all metadata internally
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

    // Build fieldMeta for applyFilterFn
    const fieldMeta = {
      all: {
        map: fields.reduce((acc, field) => {
          acc[field.path] = {
            label: field.label,
            type: field.type || 'string',
          };
          return acc;
        }, {}),
      },
    };

    // Build keysMeta for FilterPopover
    const keysMeta = fields.reduce((acc, field) => {
      acc[field.path] = {
        label: field.label,
        type: field.type || 'string',
        multiple: false,
      };
      return acc;
    }, {});

    // Build filterData for FilterPopover
    const filterData = {
      types: fields.reduce((acc, field) => {
        acc[field.path] = field.type || 'string';
        return acc;
      }, {}),
      fields: fields,
    };

    // Build defaultCondition
    const defaultCondition = config.defaultCondition
      ? {
          id: config.defaultCondition.key,
          key: config.defaultCondition.key,
          label: keysMeta[config.defaultCondition.key]?.label || config.defaultCondition.key,
          operator: config.defaultCondition.operator,
          value: config.defaultCondition.value,
          type: keysMeta[config.defaultCondition.key]?.type || 'string',
          isGroup: false,
        }
      : null;

    return { fieldMeta, keysMeta, filterData, defaultCondition };
  }, [config]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!filters || !metadata.fieldMeta) return data;
    return applyFilterFn(data, filters, null, metadata.fieldMeta);
  }, [data, filters, metadata.fieldMeta]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    if (!filters) return false;
    if (Array.isArray(filters)) return filters.length > 0;
    if (filters.rules) return filters.rules.length > 0;
    return false;
  }, [filters]);

  // Clear all filters
  const clearFilters = () => setFilters(null);

  // Props to pass directly to FilterPopover
  const filterProps = metadata.filterData
    ? {
        filterData: metadata.filterData,
        defaultCondition: metadata.defaultCondition,
        filters: filters,
        updateFilters: setFilters,
        keysMeta: metadata.keysMeta,
      }
    : null;

  return {
    filteredData,
    filters,
    setFilters,
    filterProps,
    clearFilters,
    hasActiveFilters,
    filterCount: hasActiveFilters ? (Array.isArray(filters) ? filters.length : filters.rules?.length || 0) : 0,
  };
}