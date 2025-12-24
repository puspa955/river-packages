import dayjs from "dayjs/esm";

export const adjustValueType = (value, filterType) => {
  switch (filterType) {
    case "number":
      return Number(value);
    case "date":
      return dayjs(value).isValid() ? new Date(value) : new Date();
    case "boolean":
      return Boolean(value);
    case "float":
      return parseFloat(value);
    default:
      return value;
  }
};

export const decodeFiltersFromUrl = (encoded, fieldMeta) => {
  const parsed = JSON.parse(atob(encoded));
  if (Array.isArray(parsed)) {
    return parsed.map(filter => ({
      ...filter,
      value: fieldMeta.all.map[filter.key]?.type === 'date' ? new Date(filter.value) : filter.value,
    }));
  } else {
    const process = (schema) => {
      if (schema?.and) return { ...schema, and: schema.and.map(process) };
      if (schema?.or) return { ...schema, or: schema.or.map(process) };
      if (schema?.key && fieldMeta.all.map[schema.key]?.type === 'date') {
        return { ...schema, value: new Date(schema.value) };
      }
      return schema;
    };
    return process(parsed);
  }
};
export const Fence = {
  "<": (a, b) => a < b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "<=": (a, b) => a <= b,
  "=": (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) return b.some(item => a.includes(item));
    if (Array.isArray(a)) return a.includes(b);
    if (Array.isArray(b)) return b.includes(a);
    return a === b;
  },
  "!=": (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) return !b.some(item => a.includes(item));
    if (Array.isArray(a)) return !a.includes(b);
    if (Array.isArray(b)) return !b.includes(a);
    return a !== b;
  },
  contains: (a, b) => typeof a === "string" && typeof b === "string" ? a.toLowerCase().includes(b.toLowerCase()) : false,
  beginswith: (a, b) => typeof a === "string" && typeof b === "string" ? a.toLowerCase().startsWith(b.toLowerCase()) : false,
  process(a, b, operator) {
    return this[operator](a, b);
  },
};

function getNestedValue(obj, path) {
  if (!path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Function to evaluate a filter schema against an item
export function evaluateFilter(item, schema) {
  if (!schema) return true;

  if (schema.operator && Array.isArray(schema.rules) && schema.rules.length === 1) {
    return evaluateFilter(item, schema.rules[0]);
  }
  
  if (Array.isArray(schema)) {
    return schema.every(sub => evaluateFilter(item, sub));
  }

  if (schema.operator && Array.isArray(schema.rules)) {
    const operator = schema.operator.toLowerCase();

    if (operator === "and") {
      return schema.rules.every(sub => evaluateFilter(item, sub));
    }

    if (operator === "or") {
      return schema.rules.some(sub => evaluateFilter(item, sub));
    }
  }

  if (schema.key && schema.operator && schema.value !== undefined) {
    const { key, value, operator } = schema;

    // ✅ FIX: Use nested path accessor instead of direct property access
    let itemValue = getNestedValue(item, key);

    // Handle undefined/null values
    if (itemValue === undefined || itemValue === null) {
      if (operator === '!=' || operator === 'not_equals') {
        return value !== null && value !== undefined && value !== '';
      }
      return false;
    }

    try {
      return Fence.process(itemValue, value, operator);
    } catch (error) {
      console.warn('Filter evaluation error:', error, { key, value, operator, itemValue });
      return false;
    }
  }

  return true;
}

export function processDateFiltersInSchema(schema, fieldMeta) {
  if (!schema) return schema;

  // Helper to check if a field is a date type
  const isDateField = (key) => {
    if (!key || !fieldMeta?.all?.map) return false;
    return fieldMeta.all.map[key]?.type === "date";
  };

  // Array of filters (AND by default)
  if (Array.isArray(schema)) {
    return schema.map((item) => processDateFiltersInSchema(item, fieldMeta));
  }

  // Handle UI schema: operator + rules
  if (schema.operator && Array.isArray(schema.rules)) {
    return {
      ...schema,
      rules: schema.rules.map((item) => processDateFiltersInSchema(item, fieldMeta)),
    };
  }

  // Handle legacy AND/OR recursively
  if (schema.and) {
    return {
      ...schema,
      and: schema.and.map((item) => processDateFiltersInSchema(item, fieldMeta)),
    };
  }
  if (schema.or) {
    return {
      ...schema,
      or: schema.or.map((item) => processDateFiltersInSchema(item, fieldMeta)),
    };
  }

  // Leaf node: process if date field
  if (schema.key && isDateField(schema.key) && typeof schema.value === "string") {
    return {
      ...schema,
      value: new Date(schema.value),
    };
  }

  // Otherwise, return as is
  return schema;
}
// Filter function to apply conditions on features
export const filter = (features, filters, fields, fieldMeta) => {
  if (!filters) return Array.isArray(features) ? [...features] : [];
  const processedFilters = processDateFiltersInSchema(filters, fieldMeta);
  return features.filter((item) => {
    const dataToEvaluate = fields && fields[item.id] ? fields[item.id] : item;
    const result = evaluateFilter(dataToEvaluate, processedFilters);
    return result;
  });
}
// Function to count conditions in a filter schema
export function countConditions(node) {
  if (!node) return 0;
  // If it's an array, sum all
  if (Array.isArray(node)) {
    return node.reduce((sum, n) => sum + countConditions(n), 0);
  }
  // If it's a group (has rules), recurse
  if (node.rules && Array.isArray(node.rules)) {
    return countConditions(node.rules);
  }
  // If it's a condition (has key), count as 1
  if (node.key) return 1;
  return 0;
}
