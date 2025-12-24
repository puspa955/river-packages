import React, { useState, useEffect } from "react";
import FilterGroup, { createCondition, createGroup } from "./FilterGroup";
import { FAIcon, Button } from "@ankamala/core"; 


const AddButtons = ({ onAddCondition, onAddGroup }) => (
  <div className="flex gap-6">
    <span
      className="text-gray-600 font-medium cursor-pointer hover:text-primary-600 text-sm"
      onClick={onAddCondition}
    >
      + Add condition
    </span>
    <span
      className="text-gray-600 font-medium cursor-pointer hover:text-primary-600 text-sm"
      onClick={onAddGroup}
    >
      + Add condition group
    </span>
  </div>
);

// Helper function to clean up the filter structure for backend
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

  return {
    operator: group.operator || "and",
    rules: rules,
  };
};

// Backend to UI format
const convertBackendToUIFilter = (backendGroup) => {
  if (!backendGroup) return null;

  if (backendGroup.operator && Array.isArray(backendGroup.rules)) {
    return {
      id: crypto?.randomUUID(),
      isGroup: true,
      operator: backendGroup.operator,
      rules: backendGroup.rules.map(rule => {
        if (rule.operator && rule.rules) {
          return convertBackendToUIFilter(rule);
        } else {
          return {
            id: crypto?.randomUUID(),
            isGroup: false,
            ...rule
          };
        }
      })
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
    const currentRules = rootGroup.rules || [];
    setRootGroup({
      ...rootGroup,
      rules: [...currentRules, item],
    });
  };

  const createRootWithCondition = () => {
    setRootGroup(createGroup([createCondition({}, defaultCondition)]));
  };

  const createRootWithGroup = () => {
    const emptyGroup = createGroup();
    setRootGroup(createGroup([emptyGroup]));
  };

  const handleAddConditionToRoot = () =>
    addToRoot(createCondition({}, defaultCondition));
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
    <div className="text-slate-600 w-full">
      <div className="flex items-center gap-2 mb-4">
        <FAIcon icon="filter" className="text-primary-700" size="lg" />
        <h2 className="text-lg font-medium text-gray-800">Filter</h2>
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
