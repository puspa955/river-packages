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
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{
        borderTop: '1px solid var(--table-border, #e2e8f0)',
        backgroundColor: 'var(--table-footer-bg, #f8fafc)',
      }}
    >
      {/* Results count */}
      <div className="flex items-center gap-2 text-sm min-w-[140px]">
        <span style={{ color: 'var(--table-text-muted, #64748b)' }}>
          Showing{" "}
          <span className="font-semibold" style={{ color: 'var(--table-text-secondary, #475569)' }}>{startRow}</span>
          {" "}to{" "}
          <span className="font-semibold" style={{ color: 'var(--table-text-secondary, #475569)' }}>{endRow}</span>
          {" "}of{" "}
          <span className="font-semibold" style={{ color: 'var(--table-text-secondary, #475569)' }}>{totalRows}</span>
          {" "}results
        </span>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <PaginationIconBtn
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" style={{ color: 'var(--table-text-secondary, #475569)' }} />
        </PaginationIconBtn>

        <PaginationIconBtn
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" style={{ color: 'var(--table-text-secondary, #475569)' }} />
        </PaginationIconBtn>

        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((pageNum, idx) =>
            pageNum === 'ellipsis' ? (
              <div key={`ellipsis-${idx}`} className="px-2 flex items-center">
                <span className="font-medium" style={{ color: 'var(--table-text-muted, #94a3b8)' }}>...</span>
              </div>
            ) : (
              <button
                key={pageNum}
                onClick={() => table.setPageIndex(pageNum)}
                className="min-w-[2.5rem] h-10 px-3 rounded-sm font-medium text-sm transition-all"
                style={
                  pageIndex === pageNum
                    ? {
                        backgroundColor: 'var(--table-primary, #4338ca)',
                        color: 'var(--table-primary-text, #ffffff)',
                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        border: 'none',
                      }
                    : {
                        backgroundColor: 'var(--table-bg, #ffffff)',
                        color: 'var(--table-text-secondary, #334155)',
                        border: '1px solid var(--table-border, #e2e8f0)',
                      }
                }
                aria-label={`Page ${pageNum + 1}`}
                aria-current={pageIndex === pageNum ? "page" : undefined}
              >
                {pageNum + 1}
              </button>
            )
          )}
        </div>

        <PaginationIconBtn
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--table-text-secondary, #475569)' }} />
        </PaginationIconBtn>

        <PaginationIconBtn
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" style={{ color: 'var(--table-text-secondary, #475569)' }} />
        </PaginationIconBtn>
      </div>

      {/* Rows per page */}
      <div className="flex items-center gap-3 min-w-[140px] justify-end">
        <label
          htmlFor="rows-per-page"
          className="text-sm font-medium whitespace-nowrap"
          style={{ color: 'var(--table-text-muted, #64748b)' }}
        >
          Rows per page
        </label>
        <select
          id="rows-per-page"
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="px-2 py-2 rounded-sm text-sm font-medium cursor-pointer focus:outline-none"
          style={{
            border: '1px solid var(--table-input-border, #e2e8f0)',
            backgroundColor: 'var(--table-bg, #ffffff)',
            color: 'var(--table-text-secondary, #334155)',
          }}
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

// Small reusable icon button for pagination nav
function PaginationIconBtn({ onClick, disabled, children, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-2 rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        border: '1px solid var(--table-border, #e2e8f0)',
        backgroundColor: 'var(--table-bg, #ffffff)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = 'var(--table-btn-hover-bg, #f8fafc)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--table-bg, #ffffff)';
      }}
      {...props}
    >
      {children}
    </button>
  );
}