import React, { useMemo } from "react";
import {
  Tooltip, Switch, Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem, FAIcon, Input, renderSelectTrigger
} from "@ankamala/core";
import { adjustValueType } from "./utils/filterUtils";
import { DatePicker } from "./DatePicker";
import RichSelect from "./RichSelect";

const operatorMap = {
  number:  ["<", ">", "<=", ">="],
  string:  ["contains", "beginswith"],
  date:    ["<", ">", "<=", ">="],
  boolean: [],
  select:  [],
  __all__: ["=", "!="],
};

const inputTypes = {
  number: "number",
  string: "text",
  date:   "date",
};

const FilterItem = ({
  removeFilter,
  filter,
  keys,
  types,
  handleFilterChange,
  options,
  keysMeta,
}) => {
  const { key, id, operator, value } = filter;

  const filterType  = useMemo(() => key && types[key], [key, types]);
  const operators   = useMemo(() => filterType
    ? [...operatorMap["__all__"], ...operatorMap[filterType]]
    : operatorMap["__all__"], [filterType]);
  const inputType   = useMemo(() => inputTypes[filterType] || "text", [filterType]);
  const optionsArray = useMemo(() => {
    if (filterType === "select" && options?.[key]?.length) return options[key];
    return [];
  }, [filterType, options, key]);
  const dateValue   = useMemo(() => {
    if (filterType === "date" && value) return adjustValueType(value, "date");
    return null;
  }, [filterType, value]);

  const handleSelectChange = (field, val) => {
    let newProperties;
    if (field === "key") {
      newProperties = {
        [field]: val,
        operator: "=",
        value: adjustValueType("", types[val]),
      };
    } else {
      newProperties = { [field]: val };
    }
    handleFilterChange(id, newProperties);
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <div className="flex gap-4 items-center w-full">

        {/* Key */}
        <div className="flex-shrink-0 w-[200px]">
          <RichSelect
            selected={key}
            onSelect={(v) => handleSelectChange("key", v.path)}
            options={keys}
          >
            <button
              className="border-b-[1px] pl-2 text-sm focus:ring-0 flex items-center gap-1 w-full h-9"
              style={{
                borderColor: "var(--filter-input-border, #d1d5db)",
                color: "var(--filter-text, #1e293b)",
              }}
            >
              <FAIcon
                icon="sort"
                className="h-3 w-3"
                style={{ color: "var(--filter-text-muted, #6b7280)" }}
              />
              <span className="truncate">{keysMeta[key]?.label}</span>
            </button>
          </RichSelect>
        </div>

        {/* Operator */}
<div className="flex-shrink-0 w-auto">
  <RichSelect
    selected={operator}
    onSelect={(v) => handleSelectChange("operator", v.path)}
    options={operators.map(op => ({ path: op, label: op }))}
    isSearchable = {false}
  >
    <button
      className="border-b-[1px] pl-2 text-sm focus:ring-0 flex items-center w-full h-9"
      style={{
        borderColor: "var(--filter-input-border, #d1d5db)",
        color: "var(--filter-text-muted, #6b7280)",
      }}
    >
       <FAIcon
                icon="sort"
                className="h-3 w-3"
                style={{ color: "var(--filter-text-muted, #6b7280)" }}
              />
      <span className="truncate">{operator || "Select"}</span>
    </button>
  </RichSelect>
</div>

        {/* Value */}
        <div className="flex-1">
          {filterType === "select" && (
            <RichSelect
              options={optionsArray}
              selected={
                keysMeta[key].multiple
                  ? (Array.isArray(value)
                      ? value.map(val => optionsArray.find(opt => opt.path === val) || val)
                      : [])
                  : optionsArray.find(opt => opt.path === value) || value
              }
              onSelect={(newValue) => {
                const extracted = Array.isArray(newValue)
                  ? newValue.map(item => item.path ?? item)
                  : newValue.path ?? newValue;
                handleSelectChange("value", extracted);
              }}
              multiple={keysMeta[key].multiple ?? false}
              isSearchable={true}
              isSmall={false}
              showSelectedSummary={false}
             trigger={(selected) => (
  <div style={{ borderBottom: "1px solid var(--filter-input-border, #d1d5db)" }}>
    {renderSelectTrigger(
      selected,
      "sort",
      null,
      "border-0 pl-2 text-sm focus:ring-0 flex items-center w-full h-7",
      "mr-2",
      keysMeta[key].multiple
        ? "Select"
        : optionsArray.find(opt => opt.path === value)?.label || "Select"
    )}
  </div>
)}
            />
          )}

          {filterType === "date" && (
            <DatePicker
              key="date"
              placeholder="Enter a date"
              value={dateValue}
              format={"yyyy MMM dd"}
              onChange={(date) => handleSelectChange("value", date)}
              className="w-full text-sm"
              style={{
                borderColor: "var(--filter-input-border, #d1d5db)",
                color: "var(--filter-text, #1e293b)",
              }}
              calendarClassName="border-t-2"
              calendarStyle={{ borderTopColor: "var(--filter-primary, #4f46e5)" }}
            />
          )}

          {filterType === "boolean" && (
            <div className="flex justify-center items-center h-full px-8 text-center">
              <Tooltip
                tooltipText="Toggle to enable or disable"
                className="mr-2"
                style={{ color: "var(--filter-text-muted, #6b7280)" }}
              >
               <Switch
  onCheckedChange={(e) => handleSelectChange("value", !!e)}
  checked={!!value}
  className="w-9 h-4.5 rounded-full border-transparent transition-colors data-[state=checked]:bg-[var(--filter-primary,#4f46e5)] data-[state=unchecked]:bg-gray-500"
  thumbStyle="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
/>
              </Tooltip>
            </div>
          )}

          {(filterType === "string" || filterType === "number") && (
            <Input
              defaultValue={value}
              placeholder="Enter a value"
              onBlur={(e) =>
                handleSelectChange("value", adjustValueType(e?.target?.value, filterType))
              }
              type={inputType}
              className="pl-2 bg-transparent text-sm rounded-none border-t-0 border-r-0 border-b-[1px] border-l-0 h-9 w-full"
              style={{
                borderColor: "var(--filter-input-border, #d1d5db)",
                color: "var(--filter-text, #1e293b)",
                outline: "none",
              }}
            />
          )}
        </div>
      </div>

      {/* Remove */}
      <Tooltip tooltipText="Remove item">
        <div
          className="cursor-pointer transition-colors"
          style={{ color: "var(--filter-text-muted, #6b7280)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--filter-text, #1e293b)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--filter-text-muted, #6b7280)"}
          onClick={() => removeFilter(id)}
        >
          <FAIcon icon="multiply" />
        </div>
      </Tooltip>
    </div>
  );
};

export default FilterItem;