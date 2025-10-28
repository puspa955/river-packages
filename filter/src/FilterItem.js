import React, { useMemo } from "react";
import Tooltip from "../../core/library/tooltip";
import { Switch } from "../../core/library/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "../../core/library/select";

import FAIcon from "../../core/components/Icons";
import Input from "../../core/components/Input";

import { adjustValueType } from "../utils/filterUtils";
import { renderSelectTrigger } from "../../core/utils/utils";
import { DatePicker } from "./DatePicker";
import RichSelect from "./RichSelect";

const operatorMap = {
  number: ["<", ">", "<=", ">="],
  string: ["contains", "beginswith"],
  date: ["<", ">", "<=", ">="],
  boolean: [],
  select: [],
  __all__: ["=", "!="],
};

const inputTypes = {
  number: "number",
  string: "text",
  date: "date",
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

  const filterType = useMemo(() => key && types[key], [key, types]);

  const operators = useMemo(() => {
    return filterType
      ? [...operatorMap["__all__"], ...operatorMap[filterType]]
      : operatorMap["__all__"];
  }, [filterType]);

  const inputType = useMemo(
    () => inputTypes[filterType] || "text",
    [filterType]
  );

  const optionsArray = useMemo(() => {
    if (filterType === "select" && options?.[key]?.length) {
      return options[key];
    }
    return [];
  }, [filterType, options, key]);

  const handleSelectChange = (field, value) => {
    let newProperties;
    if (field === "key") {
      newProperties = {
        [field]: value,
        operator: "=",
        value: adjustValueType("", types[value]),
      };
    } else {
      newProperties = { [field]: value };
    }
    handleFilterChange(id, newProperties);
  };

  return (
  <div className="flex gap-2 items-center w-full">
    {/* Key, Operator, Value row */}
    <div className="flex gap-4 items-center w-full">
      {/* Key */}
      <div className="flex-shrink-0 w-[200px]">
        <RichSelect
          selected={key}
          onSelect={(v) => handleSelectChange("key", v.path)}
          options={keys}
        >
          <button className="border-b-[1px] pl-2 text-sm focus:ring-0 flex items-center w-full h-9">
            <FAIcon icon="sort" className="h-3 w-3" />
            <span className="truncate">{keysMeta[key]?.label}</span>
          </button>
        </RichSelect>
      </div>

      {/* Operator */}
      <div className="flex-shrink-0 w-[75px]">
        <Select
          onValueChange={(newValue) => handleSelectChange("operator", newValue)}
          value={operator}
        >
          <SelectTrigger
            iconClassName="h-3 w-3 text-gray-500"
            className="border-0 border-b-[1px] shadow-none focus:ring-0 text-sm pl-0 text-gray-600 w-full"
          >
            <SelectValue
              className="text-slate-700 truncate"
              placeholder="Select"
            />
          </SelectTrigger>
          <SelectContent className="text-slate-700">
            {operators.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            trigger={(selected) =>
              renderSelectTrigger(
                selected,
                "sort",
                null,
                "border-b-[1px] pl-2 text-sm focus:ring-0 flex items-center w-full h-9",
                "mr-2",
                keysMeta[key].multiple
                  ? "Select"
                  : optionsArray.find(opt => opt.path === value)?.label || "Select"
              )
            }
          />
        )}

        {filterType === "date" && (
          <DatePicker
            key="date"
            placeholder="Enter a date"
            value={value}
            format={"yyyy MMM dd"}
            onChange={(date) => handleSelectChange("value", date)}
            className="w-full text-sm"
            calendarClassName="border-t-2 border-primary-600"
          />
        )}

        {filterType === "boolean" && (
          <div className="flex justify-center items-center h-full text-center">
            <Tooltip tooltipText="Toggle to enable or disable" className="mr-2 text-gray-500">
              <Switch
                onCheckedChange={(e) => handleSelectChange("value", !!e)}
                checked={!!value}
                className="w-10 h-5 rounded-full border-transparent transition-colors data-[state=checked]:bg-primary-700 data-[state=unchecked]:bg-primary-700/30"
                thumbStyle="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
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
            className="pl-2 bg-transparent text-sm rounded-none border-t-0 border-r-0 border-b-[1px] border-l-0 focus:ring-2 focus:ring-primary-500 focus:border-transparent h-9 w-full"
          />
        )}
      </div>
    </div>

    {/* Remove button */}
    <Tooltip tooltipText="Remove item">
      <div onClick={() => removeFilter(id)} className="cursor-pointer">
        <FAIcon icon={"multiply"} />
      </div>
    </Tooltip>
  </div>
);

};

export default FilterItem;