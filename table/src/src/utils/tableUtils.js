import { AlertCircle, Search, Database } from "lucide-react";

export function getPageNumbers(currentPage, totalPages) {
  const pages = [];
  const showPages = 5;

  if (totalPages <= showPages + 2) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(0);

    if (currentPage <= 2) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages - 1);
    } else if (currentPage >= totalPages - 3) {
      pages.push('ellipsis');
      for (let i = totalPages - 5; i < totalPages - 1; i++) {
        pages.push(i);
      }
      pages.push(totalPages - 1);
    } else {
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages - 1);
    }
  }

  return pages;
}

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full"
          style={{ border: '4px solid var(--table-loading-track, #e2e8f0)' }}
        />
        <div
          className="w-16 h-16 rounded-full border-t-transparent animate-spin absolute top-0 left-0"
          style={{ border: '4px solid var(--table-primary, #4f46e5)', borderTopColor: 'transparent' }}
        />
      </div>
      <h3
        className="text-base font-semibold mt-6 mb-1"
        style={{ color: 'var(--table-text-primary, #0f172a)' }}
      >
        Loading data
      </h3>
      <p className="text-sm" style={{ color: 'var(--table-text-muted, #64748b)' }}>
        Please wait while we fetch your data
      </p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className="w-16 h-16 mb-4 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--table-error-bg, #fef2f2)' }}
      >
        <AlertCircle className="w-8 h-8" style={{ color: 'var(--table-error-icon, #dc2626)' }} />
      </div>
      <h3
        className="text-base font-semibold mb-1"
        style={{ color: 'var(--table-text-primary, #0f172a)' }}
      >
        Unable to load data
      </h3>
      <p className="text-sm mb-6" style={{ color: 'var(--table-text-muted, #64748b)' }}>
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium rounded-sm transition-colors"
          style={{
            backgroundColor: 'var(--table-primary, #4f46e5)',
            color: 'var(--table-primary-text, #ffffff)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--table-primary-hover, #4338ca)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--table-primary, #4f46e5)';
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = "No data available", isFiltered }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className="w-16 h-16 mb-4 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--table-empty-bg, #f8fafc)' }}
      >
        {isFiltered
          ? <Search className="w-8 h-8" style={{ color: 'var(--table-empty-icon, #94a3b8)' }} />
          : <Database className="w-8 h-8" style={{ color: 'var(--table-empty-icon, #94a3b8)' }} />
        }
      </div>
      <h3
        className="text-base font-semibold mb-1"
        style={{ color: 'var(--table-text-primary, #0f172a)' }}
      >
        {isFiltered ? "No results found" : "No data available"}
      </h3>
      <p className="text-sm" style={{ color: 'var(--table-text-muted, #64748b)' }}>
        {isFiltered ? "Try adjusting your search or filters" : message}
      </p>
    </div>
  );
}

/* ---------------- DATA NORMALIZER ---------------- */
export function normalizeData(rawData) {
  if (Array.isArray(rawData)) return rawData;
  if (typeof rawData === "object" && rawData !== null) {
    const keys = ["data", "results", "items", "list", "records", "rows"];
    for (const key of keys) if (Array.isArray(rawData[key])) return rawData[key];
    const arrayValues = Object.values(rawData).filter((v) => Array.isArray(v));
    if (arrayValues.length > 0) return arrayValues.flat();
    return [rawData];
  }
  return [];
}

/* ---------------- FILTER OPTIONS ---------------- */
export function generateFilterOptions(data, filterConfig) {
  if (!filterConfig || !filterConfig.fields) return filterConfig;

  const newConfig = { ...filterConfig };
  const getNestedValue = (obj, path) => path.split(".").reduce((acc, part) => acc?.[part], obj);

  filterConfig.fields.forEach((field) => {
    if (field.type === "select" && !newConfig[field.path]) {
      const uniqueValues = new Set();
      data.forEach((row) => {
        const value = getNestedValue(row, field.path);
        if (value !== null && value !== undefined && value !== "") uniqueValues.add(String(value));
      });
      newConfig[field.path] = Array.from(uniqueValues)
        .sort()
        .map((v) => ({ path: v, label: v }));
    }
  });

  return newConfig;
}