import React from "react";
import FilterItem from "./FilterItem";
import { FAIcon, Tooltip } from "@ankamala/core";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@ankamala/core";
import { cn } from "@ankamala/core";

// Constants
const MAX_NESTING_LEVEL = 2;

// Utility functions
const generateId = () => crypto?.randomUUID();

const createCondition = (overrides = {}, defaultCondition) => ({
  id: generateId(),
  ...defaultCondition,
  ...overrides,
  isGroup: false,
});

const createGroup = (children = [], operator = "and") => ({
  id: generateId(),
  isGroup: true,
  operator: operator.toLowerCase(), 
  rules: children, 
});

export { createCondition, createGroup }; 

// Subcomponents
const AddButtons = ({ onAddCondition, onAddGroup, canAddGroup = true, level = 0 }) => {
  const isMaxLevel = level >= MAX_NESTING_LEVEL;
  const baseButtonClass = "text-gray-600 font-medium cursor-pointer hover:text-primary-600 text-sm";
  const disabledButtonClass = "text-gray-400 text-sm cursor-not-allowed";

  return (
    <div className="flex gap-4">
      <span className={baseButtonClass} onClick={onAddCondition}>
        + Add condition
      </span>
      {canAddGroup && (
        isMaxLevel ? (
          <Tooltip tooltipText="Filter condition can only be nested three level deep">
            <span className={disabledButtonClass}>+ Add condition group</span>
          </Tooltip>
        ) : (
          <span className={baseButtonClass} onClick={onAddGroup}>
            + Add condition group
          </span>
        )
      )}
    </div>
  );
};

const LogicSelector = ({ value, onChange }) => (
  <Select
    value={value.toUpperCase()}
    onValueChange={(val) => onChange(val.toLowerCase())}
  >
    <SelectTrigger
      iconClassName="h-3 w-3 text-gray-500"
      className="
        border-0 border-b
        shadow-none focus:ring-0
        text-sm pl-0 text-gray-600
        w-auto inline-flex gap-1
      "
    >
      <SelectValue />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="AND">and</SelectItem>
      <SelectItem value="OR">or</SelectItem>
    </SelectContent>
  </Select>
);


const FilterGroup = ({
  group,
  onChange,
  onRemove,
  keys,
  types,
  options,
  defaultCondition,
  keysMeta,
  level = 0,
  isRoot = false,
}) => {
  const children = group.rules || [];
  const logic = group.operator || group.logic || "and";

  const updateChild = (id, updated) => {
    const updatedChildren = children.map((child) => (child.id === id ? updated : child));
    onChange({
      ...group,
      rules: updatedChildren,
    });
  };

  const removeChild = (id) => {
    const filteredChildren = children.filter((child) => child.id !== id);
    onChange({
      ...group,
      rules: filteredChildren,
    });
  };

  const addToGroup = (item) => {
    onChange({
      ...group,
      rules: [...children, item],
    });
  };

  const updateLogic = (newLogic) => {
    onChange({
       ...group,
       operator: newLogic.toLowerCase(),
    });
  };

  const handleAddCondition = () => addToGroup(createCondition({}, defaultCondition));
  const handleAddGroup = () => addToGroup(createGroup());

  const showGroupStyling = !isRoot;
  const showGroupControls = !isRoot;
  const isEmpty = children.length === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        showGroupStyling && "rounded-sm py-2 px-4 border bg-gray-100"
      )}
    >
      {isEmpty && showGroupControls && (
        <div className="text-sm font-light">Add conditions or sub-groups.</div>
      )}

      {children.map((child, index) => (
        <div key={child.id} className="flex gap-2 items-start">
          {index === 0 ? (
            <span className="w-[55px] pt-2 text-sm font-medium text-gray-700">Where</span>
          ) : index === 1 ? (
            <LogicSelector value={logic} onChange={updateLogic} />
          ) : (
            <span className="w-[55px] pt-2 text-sm text-gray-700">
              {logic}
            </span>
          )}
          <div className="flex-1">
            {child.isGroup ? (
              <FilterGroup
                group={child}
                onChange={(updated) => updateChild(child.id, updated)}
                onRemove={() => removeChild(child.id)}
                keys={keys}
                types={types}
                options={options}
                defaultCondition={defaultCondition}
                keysMeta={keysMeta}
                level={level + 1}
                isRoot={false}
              />
            ) : (
              <FilterItem
                filter={child}
                handleFilterChange={(id, props) =>
                  updateChild(child.id, { ...child, ...props })
                }
                removeFilter={() => removeChild(child.id)}
                types={types}
                keys={keys}
                options={options}
                keysMeta={keysMeta}
              />
            )}
          </div>
        </div>
      ))}

      {showGroupControls && (
        <div className="flex justify-between gap-10 items-center pt-2 border-t border-gray-200">
          <AddButtons
            onAddCondition={handleAddCondition}
            onAddGroup={handleAddGroup}
            level={level}
          />
          <Tooltip tooltipText="Remove group">
            <button
              onClick={onRemove}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FAIcon icon="multiply" />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default FilterGroup;