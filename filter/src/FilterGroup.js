import React from "react";
import FilterItem from "./FilterItem";
import { FAIcon, Tooltip } from "@ankamala/core";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@ankamala/core";
import { cn } from "@ankamala/core";

const MAX_NESTING_LEVEL = 2;
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

const hoverIn  = e => e.currentTarget.style.color = "var(--filter-add-hover, #4f46e5)";
const hoverOut = e => e.currentTarget.style.color = "var(--filter-text-muted, #6b7280)";

const AddButtons = ({ onAddCondition, onAddGroup, canAddGroup = true, level = 0 }) => {
  const isMaxLevel = level >= MAX_NESTING_LEVEL;

  return (
    // Always one row, even on a phone — a tighter gap on small screens is
    // what buys back the room, not wrapping the second link onto its own line.
    <div className="flex flex-nowrap items-center gap-x-2 sm:gap-x-4">
      <span
        className="font-medium cursor-pointer text-sm transition-colors whitespace-nowrap"
        style={{ color: "var(--filter-text-muted, #6b7280)" }}
        onMouseEnter={hoverIn}
        onMouseLeave={hoverOut}
        onClick={onAddCondition}
      >
        + Add condition
      </span>
      {canAddGroup && (
        isMaxLevel ? (
          <Tooltip tooltipText="Filter condition can only be nested three levels deep">
            <span
              className="text-sm cursor-not-allowed whitespace-nowrap"
              style={{ color: "var(--filter-text-placeholder, #9ca3af)" }}
            >
              + Add condition group
            </span>
          </Tooltip>
        ) : (
          <span
            className="font-medium cursor-pointer text-sm transition-colors whitespace-nowrap"
            style={{ color: "var(--filter-text-muted, #6b7280)" }}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
            onClick={onAddGroup}
          >
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
      iconClassName="h-3 w-3"
      className="border-0 border-b shadow-none focus:ring-0 text-sm pl-0 w-auto inline-flex gap-1"
      style={{
        color: "var(--filter-text-muted, #6b7280)",
        borderColor: "var(--filter-input-border, #d1d5db)",
      }}
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

  const updateChild = (id, updated) =>
    onChange({ ...group, rules: children.map(c => c.id === id ? updated : c) });

  const removeChild = (id) =>
    onChange({ ...group, rules: children.filter(c => c.id !== id) });

  const addToGroup = (item) =>
    onChange({ ...group, rules: [...children, item] });

  const updateLogic = (newLogic) =>
    onChange({ ...group, operator: newLogic.toLowerCase() });

  const handleAddCondition = () => addToGroup(createCondition({}, defaultCondition));
  const handleAddGroup    = () => addToGroup(createGroup());

  const showGroupStyling  = !isRoot;
  const showGroupControls = !isRoot;
  const isEmpty = children.length === 0;

  return (
    <div
      className={cn("flex flex-col gap-4", showGroupStyling && "rounded-sm py-2 px-3 sm:px-4")}
      style={showGroupStyling ? {
        border: "1px solid var(--filter-border, #e5e7eb)",
        background: "var(--filter-bg-group, #f3f4f6)",
        borderRadius: "var(--filter-radius, 2px)",
      } : {}}
    >
      {isEmpty && showGroupControls && (
        <div
          className="text-sm font-light"
          style={{ color: "var(--filter-text-muted, #6b7280)" }}
        >
          Add conditions or sub-groups.
        </div>
      )}

      {children.map((child, index) => (
        <div key={child.id} className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-start">
          {index === 0 ? (
            <span
              className="sm:w-[55px] sm:shrink-0 sm:pt-2 text-sm font-medium"
              style={{ color: "var(--filter-text, #1e293b)" }}
            >
              Where
            </span>
          ) : index === 1 ? (
            // Same `sm:w-[55px]` column as "Where" / the and/or text below, so
            // the condition/group box beside it lines up with the others
            // instead of starting wherever the select's own content ends.
            <div className="sm:w-[55px] sm:shrink-0">
              <LogicSelector value={logic} onChange={updateLogic} />
            </div>
          ) : (
            <span
              className="sm:w-[55px] sm:shrink-0 sm:pt-2 text-sm"
              style={{ color: "var(--filter-text-muted, #6b7280)" }}
            >
              {logic}
            </span>
          )}
          <div className="w-full min-w-0 sm:flex-1">
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
        <div
          className="flex items-center justify-between gap-2 sm:gap-4 pt-2"
          style={{ borderTop: "1px solid var(--filter-border, #e5e7eb)" }}
        >
          {/* "+ Add condition", "+ Add condition group" and the remove button
              all stay on the one row on a phone too — AddButtons' own gap
              just tightens instead of anything here wrapping. */}
          <div className="min-w-0 flex-1">
            <AddButtons
              onAddCondition={handleAddCondition}
              onAddGroup={handleAddGroup}
              level={level}
            />
          </div>
          <Tooltip tooltipText="Remove group">
            <button
              onClick={onRemove}
              className="transition-colors shrink-0"
              style={{ color: "var(--filter-text-muted, #6b7280)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--filter-text, #1e293b)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--filter-text-muted, #6b7280)"}
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