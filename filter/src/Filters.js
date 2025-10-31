import FiltersInner from "./Filter";
import { cn } from "@ankamala/core";


export default function Filters({ className, closePopover, options, filterData, defaultCondition, filters, updateFilters, keysMeta }) {

  return (
    <div className={cn(className)}>
      <FiltersInner
        keys={filterData?.fields || []}
        types={filterData?.types || {}}
        initialFilters={filters}
        updateFilters={updateFilters}
        options={options} 
        defaultCondition={defaultCondition}
        keysMeta={keysMeta}
        closePopover={closePopover}
      />
    </div>
  );
}
