"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  data, // can be array, URL string, or async function
  renderContent,
  enableUrlSync = true,
  className = "",
}) => {
  const [filters, setFilters] = useState({});
  const [sourceData, setSourceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------ Load data ------------------
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;

        if (Array.isArray(data)) {
          result = data;
        } else if (typeof data === "string") {
          // Treat as URL
          const res = await fetch(data);
          result = await res.json();
        } else if (typeof data === "function") {
          // Async function
          result = await data();
        } else {
          console.warn(
            "DatasetFilter: data must be array, URL string, or async function"
          );
          result = [];
        }

        // Ensure result is array
        setSourceData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [data]);

  // ------------------ Filters ------------------
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

  // ------------------ URL Sync ------------------
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

  // ------------------ Schema & Filtering ------------------
  const updatedSchema = useMemo(
    () => updateSchemaWithDynamicOptions(schema, sourceData || []),
    [schema, sourceData]
  );

  const filteredData = useMemo(
    () => applyFilters(sourceData || [], filters, updatedSchema),
    [sourceData, filters, updatedSchema]
  );

  // ------------------ Loading / Error ------------------
  if (loading) {
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

  // ------------------ Render ------------------
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
