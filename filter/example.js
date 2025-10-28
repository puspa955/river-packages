import React, { useState } from "react";
import { FilterPopover } from "@ankamala/filter";

// Example keysMeta (used to describe available filter fields)
const keysMeta = {
  "source.gbp.rank": { label: "GBP Rank", type: "number" },
  name: { label: "Name", type: "string" },
};

// Example options (simple, user-friendly list)
const options = [
  { label: "Source", path: "source" },
  { label: "Name", path: "name" },
  { label: "GBP Rank", path: "source.gbp.rank" },
];

// Optional filterData — defines how actual data filtering works
// (You can skip this if you’re just testing UI behavior)
const filterData = {
  fields: options,
  types: {
    "source.gbp.rank": "number",
    name: "string",
  },
};

export default function Example() {
  const [filters, setFilters] = useState(null);

  const updateFilters = (newFilters) => {
    console.log("✅ Applied Filters:", newFilters);
    setFilters(newFilters);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ fontWeight: "600", marginBottom: "20px" }}>
        🧩 Filter UI Example
      </h2>
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
    </div>
  );
}
