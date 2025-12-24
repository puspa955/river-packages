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
import { FilterPopover, useFilter } from "@ankamala/ui-libraries/filter";
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
      <div className="bg-white rounded-sm border border-slate-200 shadow-lg overflow-hidden">
        {/* Header */}
        {(tableTitle || enableSearch || enableFilter) && (
          <div className="px-6 py-5 bg-slate-50">
            <div className="flex items-center justify-between gap-6">
              {tableTitle && (
            <div className="flex-shrink-0">
                <h2 className="text-xl font-semibold text-slate-900">
                {tableTitle}
                </h2>

            {tableSubtitle && (
            <p className="text-sm text-slate-500 mt-1">
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
              <thead className={`bg-slate-50 backdrop-blur-sm ${stickyHeader ? "sticky top-0 z-10" : ""}`}>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b-2 border-slate-200">
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        {h.isPlaceholder
                          ? null
                          : (
                            <div
                              className={`flex items-center gap-2 ${h.column.getCanSort() ? "cursor-pointer select-none group" : ""}`}
                              onClick={h.column.getToggleSortingHandler()}
                            >
                              {flexRender(h.column.columnDef.header, h.getContext())}
                              {enableSorting && h.column.getCanSort() && (
                                <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                                  {h.column.getIsSorted() === "asc" ? (
                                    <ChevronUp className="w-4 h-4 text-primary-600" />
                                  ) : h.column.getIsSorted() === "desc" ? (
                                    <ChevronDown className="w-4 h-4 text-primary-600" />
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

              <tbody className="divide-y divide-slate-100">
                {tableData.length > 0 && hasResults ? (
                  table.getRowModel().rows.map((row, idx) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      className={`transition-all ${
                        zebraStripes && idx % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                      } ${onRowClick ? "cursor-pointer hover:bg-primary-50/50 hover:shadow-sm" : "hover:bg-slate-50/50"}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 text-sm text-slate-700">
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