import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterPanel } from "./FilterPanel";
import { SearchHeader } from "./FilterItem";
import { applyFilters, updateSchemaWithDynamicOptions, decodeFilters, encodeFilters } from "./FilterUtils";
import { Loader2 } from "lucide-react";

export const DatasetFilter = ({
  schema,
  data = null, // Static data (if provided, no fetching)
  url = null, // URL for fetching data
  queryKey = null, // Optional custom query key
  queryFn = null, // Optional custom query function
  dataTransform = null, // Optional custom data transform
  renderContent,
  enableUrlSync = true,
  queryOptions = {},
  className = ""
}) => {
  const [filters, setFilters] = useState({});

  // Internal query function
  const internalQueryFn = useCallback(async () => {
    if (queryFn) return queryFn();
    
    if (!url) {
      throw new Error("Either data, url, or queryFn must be provided");
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
    return res.json();
  }, [url, queryFn]);

  // Internal data transform that handles common response structures
  const internalDataTransform = useCallback((result) => {
    if (dataTransform) return dataTransform(result);
    if (!result) return [];
    // Handle common response formats
    return result.list || result.data || result;
  }, [dataTransform]);

  // Generate query key
  const generatedQueryKey = useMemo(() => {
    if (queryKey) return queryKey;
    if (url) return ['dataset-url', url];
    return ['dataset'];
  }, [queryKey, url]);

  // Determine if we should fetch data (must be a boolean)
  const shouldFetch = Boolean(!data && (url || queryFn));

  const { data: fetchedData, isLoading, error } = useQuery({
    queryKey: generatedQueryKey,
    queryFn: internalQueryFn,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    ...queryOptions
  });

  // Use static data or fetched data
  const sourceData = useMemo(() => {
    if (data) return Array.isArray(data) ? data : [];
    return internalDataTransform(fetchedData) || [];
  }, [data, fetchedData, internalDataTransform]);

  const updatedSchema = useMemo(
    () => updateSchemaWithDynamicOptions(schema, sourceData),
    [schema, sourceData]
  );

  const filteredData = useMemo(
    () => applyFilters(sourceData, filters, updatedSchema),
    [sourceData, filters, updatedSchema]
  );

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
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