import React, { useState, useEffect } from "react";
import FilterGroup, { createCondition, createGroup } from "./FilterGroup";
import { FAIcon, Button } from "@ankamala/core";

const AddButtons = ({ onAddCondition, onAddGroup }) => (
  <div className="flex gap-6">
    <span
      className="font-medium cursor-pointer text-sm transition-colors"
      style={{ color: "var(--filter-text-muted, #6b7280)" }}
      onMouseEnter={e => e.currentTarget.style.color = "var(--filter-primary, #4f46e5)"}
      onMouseLeave={e => e.currentTarget.style.color = "var(--filter-text-muted, #6b7280)"}
      onClick={onAddCondition}
    >
      + Add condition
    </span>
    <span
      className="font-medium cursor-pointer text-sm transition-colors"
      style={{ color: "var(--filter-text-muted, #6b7280)" }}
      onMouseEnter={e => e.currentTarget.style.color = "var(--filter-primary, #4f46e5)"}
      onMouseLeave={e => e.currentTarget.style.color = "var(--filter-text-muted, #6b7280)"}
      onClick={onAddGroup}
    >
      + Add condition group
    </span>
  </div>
);

const cleanFilterForBackend = (group) => {
  if (!group) return null;
  if (!group.isGroup) {
    const { id, isGroup, ...condition } = group;
    if (!condition.key || !condition.operator) return null;
    return condition;
  }
  const rules = (group.rules || [])
    .map(child => cleanFilterForBackend(child))
    .filter(Boolean);
  if (rules.length === 0) return null;
  return { operator: group.operator || "and", rules };
};

const convertBackendToUIFilter = (backendGroup) => {
  if (!backendGroup) return null;
  if (backendGroup.operator && Array.isArray(backendGroup.rules)) {
    return {
      id: crypto?.randomUUID(),
      isGroup: true,
      operator: backendGroup.operator,
      rules: backendGroup.rules.map(rule => {
        if (rule.operator && rule.rules) return convertBackendToUIFilter(rule);
        return { id: crypto?.randomUUID(), isGroup: false, ...rule };
      }),
    };
  }
  return null;
};

const Filter = ({
  keys,
  types,
  initialFilters,
  updateFilters,
  options,
  defaultCondition,
  keysMeta,
  closePopover,
}) => {
  const [rootGroup, setRootGroup] = useState(() => {
    if (!initialFilters) return null;
    return initialFilters.isGroup
      ? initialFilters
      : convertBackendToUIFilter(initialFilters);
  });

  const hasFilters = (rootGroup?.rules || []).length > 0;
  const showFilterGroup = Boolean(rootGroup && hasFilters);

  const handleApply = () => {
    const backendFilter = cleanFilterForBackend(rootGroup);
    updateFilters(backendFilter);
    closePopover();
  };

  const addToRoot = (item) => {
    if (!rootGroup) return;
    setRootGroup({ ...rootGroup, rules: [...(rootGroup.rules || []), item] });
  };

  const createRootWithCondition = () =>
    setRootGroup(createGroup([createCondition({}, defaultCondition)]));

  const createRootWithGroup = () =>
    setRootGroup(createGroup([createGroup()]));

  const handleAddConditionToRoot = () => addToRoot(createCondition({}, defaultCondition));
  const handleAddGroupToRoot = () => addToRoot(createGroup());

  useEffect(() => {
    if (initialFilters) {
      const uiFormatted = initialFilters.isGroup
        ? initialFilters
        : convertBackendToUIFilter(initialFilters);
      setRootGroup(uiFormatted);
    }
  }, [initialFilters]);

  return (
    <div className="w-full" style={{ color: "var(--filter-text, #1e293b)" }}>
      <div className="flex items-center gap-2 mb-4">
        <FAIcon
          icon="filter"
          size="lg"
          style={{ color: "var(--filter-primary, #4f46e5)" }}
        />
        <h2
          className="text-lg font-medium"
          style={{ color: "var(--filter-text, #1e293b)" }}
        >
          Filter
        </h2>
      </div>

      {!rootGroup ? (
        <AddButtons
          onAddCondition={createRootWithCondition}
          onAddGroup={createRootWithGroup}
        />
      ) : (
        <>
          {showFilterGroup && (
            <div className="flex gap-2 items-start mb-4">
              <div className="flex-1">
                <FilterGroup
                  group={rootGroup}
                  onChange={setRootGroup}
                  onRemove={() => setRootGroup(null)}
                  keys={keys}
                  types={types}
                  options={options}
                  defaultCondition={defaultCondition}
                  keysMeta={keysMeta}
                  level={0}
                  isRoot={true}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center gap-10">
            <AddButtons
              onAddCondition={handleAddConditionToRoot}
              onAddGroup={handleAddGroupToRoot}
            />
            <Button
              className="rounded-sm shadow-sm text-xs transition-all hover:shadow-md"
              style={{
                background: "var(--filter-primary, #4f46e5)",
                color: "var(--filter-primary-text, #ffffff)",
                borderRadius: "var(--filter-radius, 2px)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--filter-primary-hover, #4338ca)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--filter-primary, #4f46e5)"}
              onClick={handleApply}
            >
              <FAIcon icon="filter" className="mr-1" size="sm" />
              <span>Apply</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Filter;