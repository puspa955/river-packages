import React, { useState } from "react";
import { FilterPopover } from "@ankamala/filter";
import { RichSelect } from "@ankamala/select";
import { FAIcon } from "@ankamala/core";

// Example keysMeta — describes available filter fields
const keysMeta = {
  "source.gbp.rank": { label: "GBP Rank", type: "number" },
  name: { label: "Name", type: "string" },
  category: { label: "Category", type: "string" },
};

// Example options — used by both FilterPopover and RichSelect
const options = [
  { label: "Source", path: "source" },
  { label: "Name", path: "name" },
  { label: "GBP Rank", path: "source.gbp.rank" },
  { label: "Category", path: "category" },
];

// Filter config (optional, used by FilterPopover)
const filterData = {
  fields: options,
  types: {
    "source.gbp.rank": "number",
    name: "string",
    category: "string",
  },
};


export default function Example() {
  const [filters, setFilters] = useState(null);
  const [sortSelected, setSortSelected] = useState(filterData.fields[0]);

  const updateFilters = (newFilters) => {
    console.log("✅ Applied Filters:", newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🧩 Filter + RichSelect Example</h1>

      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-center">
        {/* Filter UI */}
        <FilterPopover
          options={options}
          filterData={filterData}
          defaultCondition={{
            key: "source.gbp.rank",
            operator: "<=",
            value: 10,
          }}
          filters={filters}
          updateFilters={updateFilters}
          keysMeta={keysMeta}
        />

        {/* Sort Dropdown (RichSelect) */}
        <RichSelect
          selected={sortSelected}
          onSelect={setSortSelected}
          options={filterData.fields}
          trigger={(selected, className, iconClassName) => (
            <button
              className={`flex items-center gap-2 border px-3 py-1 rounded-md text-sm text-gray-600 ${className}`}
            >
              <FAIcon icon="sort" className={`h-3 w-3 ${iconClassName}`} />
              <span>{selected?.label || "Sort by"}</span>
            </button>
          )}
        />
      </div>

      {/* Show applied filters */}
      {filters && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Current Filters:</h3>
          <pre className="text-sm">{JSON.stringify(filters, null, 2)}</pre>
        </div>
      )}

      {/* Show selected sort */}
      {sortSelected && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Sort Selected:</h3>
          <pre className="text-sm">{JSON.stringify(sortSelected, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
