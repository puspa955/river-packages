import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { getPageNumbers } from "./utils/tableUtils";

export default function TablePagination({ table, rowsPerPageOptions = [5, 10, 25, 50] }) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const pageNumbers = getPageNumbers(pageIndex, pageCount);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
      
      <div className="flex items-center gap-2 text-sm min-w-[140px]">
        <span className="text-slate-600">
          Showing <span className="font-semibold text-slate-500">{startRow}</span> to{" "}
          <span className="font-semibold text-slate-500">{endRow}</span> of{" "}
          <span className="font-semibold text-slate-500">{totalRows}</span> results
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="p-2 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4 text-slate-600" />
        </button>

        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-2 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((pageNum, idx) =>
            pageNum === 'ellipsis' ? (
              <div key={`ellipsis-${idx}`} className="px-2 flex items-center">
                <span className="text-slate-400 font-medium">...</span>
              </div>
            ) : (
              <button
                key={pageNum}
                onClick={() => table.setPageIndex(pageNum)}
                className={`min-w-[2.5rem] h-10 px-3 rounded-sm font-medium text-sm transition-all ${
                  pageIndex === pageNum
                    ? "bg-primary-700 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
                aria-label={`Page ${pageNum + 1}`}
                aria-current={pageIndex === pageNum ? "page" : undefined}
              >
                {pageNum + 1}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>

        <button
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          className="p-2 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="flex items-center gap-3 min-w-[140px] justify-end">
        <label htmlFor="rows-per-page" className="text-sm font-medium text-slate-600 whitespace-nowrap">
          Rows per page
        </label>
        <select
          id="rows-per-page"
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="px-2 py-2 border border-slate-200 rounded-sm bg-white text-slate-700 text-sm font-medium hover:border-slate-300 focus:outline-none focus:border-primary-500/50 cursor-pointer"
        >
          {rowsPerPageOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}