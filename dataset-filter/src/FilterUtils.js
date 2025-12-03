export const getNestedValue = (obj, path) => {
  if (!path || !obj) return null;
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return null;
    return acc[part];
  }, obj);
};


export const applyFilters = (data, filters, schema) => {
  const flatSchema = {};
  
  const flattenSchema = (schemaObj) => {
    Object.entries(schemaObj).forEach(([key, config]) => {
      if (config.type === "group" && config.childrenSchema) {
        Object.entries(config.childrenSchema).forEach(([childKey, childConfig]) => {
          flatSchema[childKey] = childConfig;
        });
      } else if (config.type !== "search") {
        flatSchema[key] = config;
      }
    });
  };

  flattenSchema(schema);

  return data.filter(item => {
    return Object.entries(filters).every(([filterKey, filterValue]) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return true;

      const config = flatSchema[filterKey];
      if (!config) return true;

      let itemValue = getNestedValue(item, config.field);

      switch (config.type) {
        case 'search': {
          const fields = Array.isArray(config.fields) ? config.fields : [config.field];
          return fields.some(field => {
            const value = getNestedValue(item, field);
            return String(value || '').toLowerCase().includes(filterValue.toLowerCase());
          });
        }

        case 'checkbox-group': {
          if (config.transform && itemValue !== null && itemValue !== undefined) {
            itemValue = config.transform(itemValue);
          }

          const itemArray = Array.isArray(itemValue) ? itemValue : [itemValue];
          const selected = Array.isArray(filterValue) ? filterValue : [filterValue];

          const normalizedItemArray = itemArray.map(val => 
            val ? String(val).toLowerCase() : val
          );
          const normalizedSelected = selected.map(val => 
            val ? String(val).toLowerCase() : val
          );

          if (normalizedSelected.includes('other') && config.options) {
            const normalizedOptions = config.options.map(opt => opt.toLowerCase());
            const otherSelected = normalizedItemArray.some(
              val => val && !normalizedOptions.includes(val)
            );
            if (otherSelected) return true;
          }

          return normalizedSelected.some(val => normalizedItemArray.includes(val));
        }

        case 'range': {
          const numValue = Number(itemValue);
          if (isNaN(numValue) || itemValue === null || itemValue === undefined) return false;

          return filterValue.some(label => {
            const range = config.ranges.find(r => r.label === label);
            return range ? numValue >= range.min && numValue <= range.max : false;
          });
        }

        case 'checkbox': {
          return filterValue ? !!itemValue : true;
        }

        case 'select': {
          if (!itemValue) return false;
          
          const itemStr = String(itemValue).toLowerCase();
          const filterStr = String(filterValue).toLowerCase();
          
          if (filterStr === 'other' && config.options) {
            const normalizedOptions = config.options.map(opt => opt.toLowerCase());
            return !normalizedOptions.includes(itemStr);
          }
          
          return itemStr === filterStr;
        }

        default:
          return true;
      }
    });
  });
};

export const extractDynamicOptions = (data, schema) => {
  const dynamicOptions = {};

  const flatSchema = {};
  
  const flattenSchema = (schemaObj) => {
    Object.entries(schemaObj).forEach(([key, config]) => {
      if (config.type === "group" && config.childrenSchema) {
        Object.entries(config.childrenSchema).forEach(([childKey, childConfig]) => {
          flatSchema[childKey] = childConfig;
        });
      } else {
        flatSchema[key] = config;
      }
    });
  };

  flattenSchema(schema);

  Object.entries(flatSchema).forEach(([key, config]) => {
    if (config.options && config.options.length > 0) return;
    if (!['checkbox-group', 'select', 'checkbox'].includes(config.type)) return;

    const optionsSet = new Set();

    data.forEach(item => {
      let value = getNestedValue(item, config.field);
      if (config.transform && value !== null && value !== undefined) {
        value = config.transform(value);
      }

      if (config.isArray && Array.isArray(value)) {
        value.forEach(v => v !== null && optionsSet.add(String(v)));
      } else if (value !== null && value !== undefined) {
        optionsSet.add(String(value));
      }
    });

    dynamicOptions[key] = Array.from(optionsSet).sort();
  });

  return dynamicOptions;
};

export const updateSchemaWithDynamicOptions = (schema, data) => {
  const dynamicOptions = extractDynamicOptions(data, schema);
  const updatedSchema = {};

  Object.entries(schema).forEach(([key, config]) => {
    updatedSchema[key] = { ...config };
    
    if (config.type === "group" && config.childrenSchema) {
      updatedSchema[key].childrenSchema = {};
      Object.entries(config.childrenSchema).forEach(([childKey, childConfig]) => {
        updatedSchema[key].childrenSchema[childKey] = { ...childConfig };
        if (dynamicOptions[childKey] && dynamicOptions[childKey].length > 0) {
          updatedSchema[key].childrenSchema[childKey].options = dynamicOptions[childKey];
        }
      });
    } else if (dynamicOptions[key] && dynamicOptions[key].length > 0) {
      updatedSchema[key].options = dynamicOptions[key];
    }
  });

  return updatedSchema;
};

export const cleanFilters = (filters) => {
  const cleaned = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (
      value === undefined || 
      value === null || 
      value === "" || 
      (Array.isArray(value) && value.length === 0) ||
      value === false 
    ) {
      return;
    }
    cleaned[key] = value;
  });
  
  return cleaned;
};

export const encodeFilters = (filters) => {
  try {
    const cleanedFilters = cleanFilters(filters);
    
    if (Object.keys(cleanedFilters).length === 0) {
      return '';
    }
    
    const json = JSON.stringify(cleanedFilters);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    return '';
  }
};

export const decodeFilters = (encoded) => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
};