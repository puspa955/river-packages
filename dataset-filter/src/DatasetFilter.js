"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterPanel } from "./FilterPanel";
import { SearchHeader } from "./FilterItem";
import { LoaderIcon } from "./icons";
import {
  applyFilters,
  updateSchemaWithDynamicOptions,
  decodeFilters,
  encodeFilters,
} from "./FilterUtils";

/**
 * The only CSS that truly cannot be expressed as inline styles:
 * - ::-webkit-scrollbar pseudo-elements
 * - @keyframes for the spinner
 *
 * Injected once inside useEffect — never runs on the server.
 */
const GLOBAL_CSS = `
@keyframes dsf-spin { to { transform: rotate(360deg); } }

.dsf-panel::-webkit-scrollbar        { width: 4px; }
.dsf-panel::-webkit-scrollbar-track  { background: transparent; }
.dsf-panel::-webkit-scrollbar-thumb  { background: #e2e5ea; border-radius: 99px; }
.dsf-panel::-webkit-scrollbar-thumb:hover { background: #8e99a4; }
.dsf-panel { scrollbar-width: thin; scrollbar-color: #e2e5ea transparent; }
`;

function useGlobalStyles() {
  useEffect(() => {
    const id = "__dsf_global__";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);
}

export const DatasetFilter = ({
  schema,
  data = null,
  dataset = null,
  queryKey = null,
  queryFn = null,
  dataTransform = null,
  renderContent,
  enableUrlSync = true,
  queryOptions = {},
  className = "",
  style = {},
}) => {
  useGlobalStyles();

  const [filters, setFilters] = useState({});

  const internalQueryFn = useCallback(async () => {
    if (queryFn) return queryFn();
    if (!dataset) throw new Error("Either 'data', 'dataset', or 'queryFn' must be provided");
    const res = await fetch(dataset);
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
    return res.json();
  }, [dataset, queryFn]);

  const internalDataTransform = useCallback((result) => {
    if (dataTransform) return dataTransform(result);
    if (!result) return [];
    return result.list || result.data || result;
  }, [dataTransform]);

  const generatedQueryKey = useMemo(() => {
    if (queryKey) return queryKey;
    if (dataset) return ["dataset-url", dataset];
    return ["dataset"];
  }, [queryKey, dataset]);

  const shouldFetch = Boolean(!data && (dataset || queryFn));

  const { data: fetchedData, isLoading, error } = useQuery({
    queryKey: generatedQueryKey,
    queryFn: internalQueryFn,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });

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
      const next = { ...prev };
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        value === false
      ) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
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
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--dsf-bg-page, #f5f6f8)",
        fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      }}>
        <div style={{ textAlign: "center" }}>
          <LoaderIcon
            size={28}
            style={{ color: "var(--dsf-primary, #3b6fd4)" }}
          />
          <p style={{
            marginTop: 10,
            fontSize: 14,
            color: "var(--dsf-text-secondary, #52616b)",
          }}>
            Loading data…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--dsf-bg-page, #f5f6f8)",
        fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      }}>
        <div style={{
          textAlign: "center",
          padding: "32px 40px",
          border: "1px solid #fecaca",
          borderRadius: "var(--dsf-radius, 5px)",
          background: "#ffffff",
          maxWidth: 400,
        }}>
          <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#dc2626", fontSize: 15 }}>
            Error loading data
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--dsf-text-secondary, #52616b)" }}>
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--dsf-bg-page, #f5f6f8)",
        fontFamily: "var(--dsf-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
        ...style,
      }}
    >
      <FilterPanel
        schema={updatedSchema}
        filters={filters}
        onFilterChange={updateFilter}
      />

      <main style={{ flex: 1, padding: "28px 32px", minWidth: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SearchHeader
            schema={updatedSchema}
            filters={filters}
            onFilterChange={updateFilter}
            onRemoveFilter={updateFilter}
          />

          {renderContent && renderContent({
            filteredData,
            totalData: sourceData,
            filters,
          })}
        </div>
      </main>
    </div>
  );
};