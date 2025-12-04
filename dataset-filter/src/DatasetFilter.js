"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterPanel } from "./FilterPanel";
import { SearchHeader } from "./FilterItem";
import {
  applyFilters,
  updateSchemaWithDynamicOptions,
  decodeFilters,
  encodeFilters,
} from "./FilterUtils";
import { Loader2 } from "lucide-react";

export const DatasetFilter = ({
  schema,
  data, // can be array, URL string, or promise function
  renderContent,
  enableUrlSync = true,
  className = "",
  queryOptions = {},
}) => {
  const [filters, setFilters] = useState({});

  // Determine the internal query function automatically
  const internalQueryFn = useMemo(() => {
    if (Array.isArray(data)) {
      return () => Promise.resolve(data); // static array
    } else if (typeof data === "string") {
      return async () => {
        const res = await fetch(data);
        const json = await res.json();
        return json;
      }; // URL string
    } else if (typeof data === "function") {
      return data; // user passed a function returning promise
    } else {
      return () => Promise.resolve([]);
    }
  }, [data]);

  const { data: fetchedData, isLoading, error } = useQuery({
    queryKey: ["dataset"],
    queryFn: internalQueryFn,
    ...queryOptions,
  });

  const sourceData = useMemo(() => {
    if (!fetchedData) return [];
    // if API response has list or items property, auto-transform
    if (Array.isArray(fetchedData)) return fetchedData;
    if (fetchedData.list) return fetchedData.list;
    if (fetchedData.items) return fetchedData.items;
    return Array.isArray(fetchedData) ? fetchedData : [];
  }, [fetchedData]);

  const updatedSchema = useMemo(
    () => updateSchemaWithDynamicOptions(schema, sourceData),
    [schema, sourceData]
  );

  const filteredData = useMemo(
    () => applyFilters(sourceData, filters, updatedSchema),
    [sourceData, filters, updatedSchema]
  );

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        value === false
      ) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  }, []);

  // URL sync
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
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error loading data: {error.message}
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
