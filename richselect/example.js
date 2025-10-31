import React, { useState } from "react";
import { RichSelect } from "@ankamala/select";
import { FAIcon } from "@ankamala/core";

// Example options for selection
const options = [
  { label: "Source", path: "source" },
  { label: "Name", path: "name" },
  { label: "GBP Rank", path: "source.gbp.rank" },
  { label: "Category", path: "category" },
];

export default function SelectExample() {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🎚️ RichSelect Example</h1>

      <div className="bg-white p-4 rounded shadow max-w-md flex flex-col gap-4">
        <RichSelect
          selected={selected}
          onSelect={setSelected}
          options={options}
          trigger={(selected, className, iconClassName) => (
            <button
              className={`flex items-center gap-2 border px-3 py-1 rounded-md text-sm text-gray-600 ${className}`}
            >
              <FAIcon icon="sort" className={`h-3 w-3 ${iconClassName}`} />
              <span>{selected?.label || "Select Option"}</span>
            </button>
          )}
        />

        {selected && (
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <span className="font-semibold">Selected:</span>{" "}
            {JSON.stringify(selected, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}
