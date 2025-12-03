import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterPanel } from "./FilterPanel";
import { SearchHeader } from "./FilterItem";
import { applyFilters, updateSchemaWithDynamicOptions, decodeFilters, encodeFilters } from "./FilterUtils";
import { Loader2 } from "lucide-react";

export const DatasetFilter = ({
  schema,
  data = [],
  queryKey,
  queryFn,
  dataTransform = (d) => d,
  renderContent,
  enableUrlSync = true,
  queryOptions = {},
  className = ""
}) => {
  const [filters, setFilters] = useState({});

  const { data: fetchedData, isLoading, error } = useQuery({
    queryKey: queryKey || ['dataset'],
    queryFn: queryFn || (() => Promise.resolve({ data })),
    enabled: !!queryFn,
    ...queryOptions
  });

  const sourceData = queryFn ? (dataTransform(fetchedData) || []) : data;

  const updatedSchema = useMemo(() => updateSchemaWithDynamicOptions(schema, sourceData), [schema, sourceData]);

  const filteredData = useMemo(() => applyFilters(sourceData, filters, updatedSchema), [sourceData, filters, updatedSchema]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0) || value === false) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  }, []);

  useEffect(() => {
    if (!enableUrlSync) return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("f");
    if (encoded) setFilters(decodeFilters(encoded));
  }, [enableUrlSync]);

  useEffect(() => {
    if (!enableUrlSync) return;
    const encoded = encodeFilters(filters);
    if (!encoded) {
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    const params = new URLSearchParams();
    params.set("f", encoded);
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [filters, enableUrlSync]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">Error loading data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 ${className}`}>
      <FilterPanel
        schema={updatedSchema}
        filters={filters}
        onFilterChange={updateFilter}
      />

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <SearchHeader
            schema={updatedSchema}
            filters={filters}
            onFilterChange={updateFilter}
            onRemoveFilter={updateFilter}
          />

          {renderContent &&
            renderContent({
              filteredData,
              totalData: sourceData,
              filters,
            })}
        </div>
      </div>
    </div>
  );
};