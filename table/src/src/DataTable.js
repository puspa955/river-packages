"use client";
import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { FilterPopover, useFilter } from "@ankamala/filter";
import SearchBar from "./SearchBar";
import TablePagination from "./TablePagination";
import { normalizeData, LoadingState, EmptyState, ErrorState, generateFilterOptions } from "./utils/tableUtils";

export default function DataTable({
  data,
  columns = [],
  enableSorting = true,
  enablePagination = true,
  enableSearch = false,
  enableFilter = false,
  searchPlaceholder = "Search...",
  filterConfig = null,
  pageSize = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  tableTitle = "Data",
  tableSubtitle,
  onRowClick,
  className = "",
  stickyHeader = false,
  zebraStripes = false,
  emptyMessage,
}) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(typeof data === "string");
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
  const [autoFilterConfig, setAutoFilterConfig] = useState(filterConfig);

  const { filteredData, filterProps, hasActiveFilters } = useFilter(tableData, autoFilterConfig);

  useEffect(() => {
    const loadData = async () => {
      if (typeof data === "string") {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(data);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const json = await res.json();
          const normalized = normalizeData(json);
          setTableData(normalized);

          if (enableFilter && filterConfig) {
            const genConfig = generateFilterOptions(normalized, filterConfig);
            setAutoFilterConfig(genConfig);
          }
        } catch (err) {
          setError(err.message);
          setTableData([]);
        } finally {
          setLoading(false);
        }
      } else {
        const normalized = normalizeData(data);
        setTableData(normalized);
        setLoading(false);

        if (enableFilter && filterConfig) {
          const genConfig = generateFilterOptions(normalized, filterConfig);
          setAutoFilterConfig(genConfig);
        }
      }
    };
    loadData();
  }, [data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting,
    globalFilterFn: "includesString",
  });

  const hasResults = table.getFilteredRowModel().rows.length > 0;
  const isFiltered = globalFilter !== "" || hasActiveFilters;

  return (
    <div className={`w-full ${className}`}>
      <div
        className="rounded-sm overflow-hidden"
        style={{
          backgroundColor: 'var(--table-bg, #ffffff)',
          border: '1px solid var(--table-border, #e2e8f0)',
          boxShadow: 'var(--table-shadow, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))',
        }}
      >
        {/* Header */}
        {(tableTitle || enableSearch || enableFilter) && (
          <div
            className="px-6 py-5"
            style={{ backgroundColor: 'var(--table-header-bg, #f8fafc)' }}
          >
            <div className="flex items-center justify-between gap-6">
              {tableTitle && (
                <div className="flex-shrink-0">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: 'var(--table-text-primary, #0f172a)' }}
                  >
                    {tableTitle}
                  </h2>
                  {tableSubtitle && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: 'var(--table-text-muted, #64748b)' }}
                    >
                      {tableSubtitle}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 flex-1 justify-end">
                {enableSearch && !loading && !error && (
                  <SearchBar value={globalFilter} onChange={setGlobalFilter} placeholder={searchPlaceholder} />
                )}
                {enableFilter && filterProps && !loading && !error && <FilterPopover filterProps={filterProps} />}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className={`overflow-x-auto ${stickyHeader ? "max-h-[600px] overflow-y-auto" : ""}`}>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={() => typeof data === "string" && setTableData([])} />
          ) : (
            <table className="w-full">
              <thead
                className={`backdrop-blur-sm ${stickyHeader ? "sticky top-0 z-10" : ""}`}
                style={{ backgroundColor: 'var(--table-header-bg, #f8fafc)' }}
              >
                {table.getHeaderGroups().map((hg) => (
                  <tr
                    key={hg.id}
                    style={{ borderBottom: '2px solid var(--table-border-header, #e2e8f0)' }}
                  >
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--table-text-header, #334155)' }}
                      >
                        {h.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-2 ${h.column.getCanSort() ? "cursor-pointer select-none group" : ""}`}
                            onClick={h.column.getToggleSortingHandler()}
                          >
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            {enableSorting && h.column.getCanSort() && (
                              <span className="transition-colors" style={{ color: 'var(--table-text-muted, #94a3b8)' }}>
                                {h.column.getIsSorted() === "asc" ? (
                                  <ChevronUp className="w-4 h-4" style={{ color: 'var(--table-primary, #4f46e5)' }} />
                                ) : h.column.getIsSorted() === "desc" ? (
                                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--table-primary, #4f46e5)' }} />
                                ) : (
                                  <ChevronsUpDown className="w-4 h-4" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {tableData.length > 0 && hasResults ? (
                  table.getRowModel().rows.map((row, idx) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      className="transition-all"
                      style={{
                        backgroundColor: zebraStripes && idx % 2 === 1
                          ? 'var(--table-row-stripe-bg, rgba(248, 250, 252, 0.4))'
                          : 'var(--table-bg, #ffffff)',
                        borderBottom: '1px solid var(--table-border-row, #f1f5f9)',
                        cursor: onRowClick ? 'pointer' : undefined,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = onRowClick
                          ? 'var(--table-row-hover-bg, rgba(238, 242, 255, 0.5))'
                          : 'var(--table-row-hover-bg-neutral, rgba(248, 250, 252, 0.5))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = zebraStripes && idx % 2 === 1
                          ? 'var(--table-row-stripe-bg, rgba(248, 250, 252, 0.4))'
                          : 'var(--table-bg, #ffffff)';
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm"
                          style={{ color: 'var(--table-text-secondary, #334155)' }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length}>
                      <EmptyState message={emptyMessage} isFiltered={isFiltered} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {enablePagination && !loading && !error && tableData.length > 0 && hasResults && (
          <TablePagination table={table} rowsPerPageOptions={rowsPerPageOptions} />
        )}
      </div>
    </div>
  );
}