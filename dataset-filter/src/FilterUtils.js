export const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : null), obj);
};

export const cleanFilters = (filters) => {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0) &&
        value !== false
    )
  );
};

export const encodeFilters = (filters) => {
  try {
    const cleaned = cleanFilters(filters);
    return Object.keys(cleaned).length ? btoa(encodeURIComponent(JSON.stringify(cleaned))) : "";
  } catch {
    return "";
  }
};

export const decodeFilters = (encoded) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return {};
  }
};

export const flattenSchema = (schema) => {
  const flat = {};
  let search = null;

  const helper = (obj) => {
    Object.entries(obj).forEach(([key, config]) => {
      if (!config) return;

      const type = String(config.type).toLowerCase();
      if (type === "group" && config.childrenSchema) {
        helper(config.childrenSchema);
      } else if (type === "search") {
        search = { key, config };
      } else {
        flat[key] = config;
      }
    });
  };

  helper(schema);
  return { flat, search };
};

const handlers = {
  "checkbox-group": (itemValue, filterValue, config) => {
    if (config.transform && itemValue != null) itemValue = config.transform(itemValue);
    const itemArray = Array.isArray(itemValue) ? itemValue : [itemValue];
    const selected = Array.isArray(filterValue) ? filterValue : [filterValue];

    const normalizedItem = itemArray.map(v => v ? String(v).toLowerCase() : v);
    const normalizedSelected = selected.map(v => v ? String(v).toLowerCase() : v);

    if (normalizedSelected.includes("other") && config.options) {
      const optionsLower = config.options.map(o => o.toLowerCase());
      if (normalizedItem.some(v => v && !optionsLower.includes(v))) return true;
    }

    return normalizedSelected.some(v => normalizedItem.includes(v));
  },

  range: (itemValue, filterValue, config) => {
    const num = Number(itemValue);
    if (isNaN(num)) return false;
    return filterValue.some(label => {
      const range = config.ranges?.find(r => r.label === label);
      return range ? num >= range.min && num <= range.max : false;
    });
  },

  checkbox: (itemValue, filterValue) => filterValue ? !!itemValue : true
};

export const applyFilters = (data, filters, schema) => {
  if (!Array.isArray(data) || !data.length) return [];
  if (!filters || !Object.keys(filters).length) return data;

  const { flat, search } = flattenSchema(schema);

  return data.filter(item => {
    if (search && filters[search.key]?.trim()) {
      const term = filters[search.key].toLowerCase();
      const fields = Array.isArray(search.config.fields) ? search.config.fields : [search.config.field];
      const matches = fields.some(f => {
        const val = getNestedValue(item, f);
        if (Array.isArray(val)) return val.some(v => String(v || "").toLowerCase().includes(term));
        return String(val || "").toLowerCase().includes(term);
      });
      if (!matches) return false;
    }

    return Object.entries(filters).every(([key, value]) => {
      if (search && key === search.key) return true; 
      if (!value || (Array.isArray(value) && !value.length)) return true;

      const config = flat[key];
      if (!config) return true;

      let itemValue = getNestedValue(item, config.field);
      const handler = handlers[config.type];
      return handler ? handler(itemValue, value, config) : true;
    });
  });
};

export const extractDynamicOptions = (data, schema) => {
  const { flat } = flattenSchema(schema);
  const options = {};

  Object.entries(flat).forEach(([key, config]) => {
    if (config.options?.length) return;
    if (!['checkbox-group', 'checkbox'].includes(config.type)) return;

    const set = new Set();
    data.forEach(item => {
      let val = getNestedValue(item, config.field);
      if (config.transform && val != null) val = config.transform(val);

      if (config.isArray && Array.isArray(val)) {
        val.forEach(v => v != null && set.add(String(v)));
      } else if (val != null) {
        set.add(String(val));
      }
    });

    options[key] = Array.from(set).sort();
  });

  return options;
};

export const updateSchemaWithDynamicOptions = (schema, data) => {
  const dynamicOptions = extractDynamicOptions(data, schema);

  const update = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, config]) => {
        if (!config) return [key, config];
        const newConfig = { ...config };

        if (config.type === "group" && config.childrenSchema) {
          newConfig.childrenSchema = update(config.childrenSchema);
        } else if (dynamicOptions[key]?.length) {
          newConfig.options = dynamicOptions[key];
        }

        return [key, newConfig];
      })
    );
  };

  return update(schema);
};
