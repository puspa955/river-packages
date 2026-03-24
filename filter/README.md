# Filter

A flexible, theme-aware filter popover component for React. Supports text, number, select, boolean, and date filter types with nested condition groups and AND/OR logic.

---

## Installation
```bash
npm install git+https://github.com/puspa955/river-packages.git#main
```

---

## Usage
```jsx
import { FilterPopover } from '@ankamala/ui-libraries/filter';
import { useState } from 'react';

export default function Example() {
  const [filters, setFilters] = useState(null);

  return (
    <FilterPopover
      filterData={FILTER_DATA}
      options={OPTIONS}
      keysMeta={KEYS_META}
      filters={filters}
      updateFilters={setFilters}
    />
  );
}
```

---

## Data Contracts

### `filterData`
Defines the available fields and their types. This is **not** your raw data array — it is the schema.
```js
const FILTER_DATA = {
  fields: [
    { path: 'name',      label: 'Name'       },
    { path: 'status',    label: 'Status'     },
    { path: 'amount',    label: 'Amount'     },
    { path: 'isActive',  label: 'Is Active'  },
    { path: 'createdAt', label: 'Created At' },
  ],
  types: {
    name:      'string',
    status:    'select',
    amount:    'number',
    isActive:  'boolean',
    createdAt: 'date',
  },
};
```

| Field    | Type     | Required | Description                                      |
|----------|----------|----------|--------------------------------------------------|
| `fields` | `array`  | yes      | List of `{ path, label }` objects for the dropdown |
| `types`  | `object` | yes      | Maps each field path to its type                 |

**Supported types:**

| Type      | Operators                          | Input        |
|-----------|------------------------------------|--------------|
| `string`  | `=`, `!=`, `contains`, `beginswith`| Text input   |
| `number`  | `=`, `!=`, `<`, `>`, `<=`, `>=`   | Number input |
| `select`  | `=`, `!=`                          | Dropdown     |
| `boolean` | `=`, `!=`                          | Toggle       |
| `date`    | `=`, `!=`, `<`, `>`, `<=`, `>=`   | Date picker  |

---

### `keysMeta`
Drives which input renders per field. Must have an entry for every field in `filterData.fields`.
```js
const KEYS_META = {
  name:      { label: 'Name',       type: 'string'  },
  status:    { label: 'Status',     type: 'select',  multiple: false },
  role:      { label: 'Role',       type: 'select',  multiple: true  },
  amount:    { label: 'Amount',     type: 'number'  },
  isActive:  { label: 'Is Active',  type: 'boolean' },
  createdAt: { label: 'Created At', type: 'date'    },
};
```

| Field      | Type      | Required | Description                              |
|------------|-----------|----------|------------------------------------------|
| `label`    | `string`  | yes      | Display label for the field              |
| `type`     | `string`  | yes      | Must match the type in `filterData.types`|
| `multiple` | `boolean` | no       | Enable multi-select for `select` type    |

---

### `options`
Select options for `select` type fields. Each value must be a `{ path, label }` object.
```js
const OPTIONS = {
  status: [
    { path: 'active',   label: 'Active'   },
    { path: 'inactive', label: 'Inactive' },
    { path: 'pending',  label: 'Pending'  },
  ],
  role: [
    { path: 'Admin',  label: 'Admin'  },
    { path: 'Editor', label: 'Editor' },
    { path: 'User',   label: 'User'   },
  ],
};
```

> **Important:** `options` is only needed for fields with `type: 'select'`. Other types do not need entries here.

---

### `filters`
Controlled state value. Starts as `null` and becomes the backend filter format after the user clicks Apply.
```js
const [filters, setFilters] = useState(null);
```

---

### `updateFilters`
Called with the cleaned backend format when the user clicks Apply.

**Output shape:**
```js
{
  operator: 'and',
  rules: [
    { key: 'amount', operator: '<=', value: 200 },
    { key: 'status', operator: '=',  value: 'active' },
  ]
}
```

For nested condition groups:
```js
{
  operator: 'and',
  rules: [
    { key: 'amount', operator: '<=', value: 200 },
    {
      operator: 'or',
      rules: [
        { key: 'status', operator: '=', value: 'active' },
        { key: 'status', operator: '=', value: 'pending' },
      ]
    }
  ]
}
```

---

## Applying Filters to Data

Use the exported `applyFilterFn` to filter your data with the output from `updateFilters`:
```js
import { FilterPopover, applyFilterFn } from '@ankamala/ui-libraries/filter';
import { useState, useMemo } from 'react';

const [filters, setFilters] = useState(null);

const filteredData = useMemo(() => {
  if (!filters) return myData;
  return applyFilterFn(myData, filters);
}, [filters]);
```

---

## Full Example
```jsx
import { FilterPopover, applyFilterFn } from '@ankamala/ui-libraries/filter';
import { useState, useMemo } from 'react';

const MOCK_DATA = [
  { name: 'Alice', status: 'active',   role: 'Admin',  amount: 120, isActive: true  },
  { name: 'Bob',   status: 'inactive', role: 'User',   amount: 85,  isActive: false },
  { name: 'Carol', status: 'pending',  role: 'Editor', amount: 200, isActive: true  },
];

const FILTER_DATA = {
  fields: [
    { path: 'name',     label: 'Name'   },
    { path: 'status',   label: 'Status' },
    { path: 'role',     label: 'Role'   },
    { path: 'amount',   label: 'Amount' },
    { path: 'isActive', label: 'Active' },
  ],
  types: {
    name:     'string',
    status:   'select',
    role:     'select',
    amount:   'number',
    isActive: 'boolean',
  },
};

const KEYS_META = {
  name:     { label: 'Name',   type: 'string'  },
  status:   { label: 'Status', type: 'select', multiple: false },
  role:     { label: 'Role',   type: 'select', multiple: true  },
  amount:   { label: 'Amount', type: 'number'  },
  isActive: { label: 'Active', type: 'boolean' },
};

const OPTIONS = {
  status: [
    { path: 'active',   label: 'Active'   },
    { path: 'inactive', label: 'Inactive' },
    { path: 'pending',  label: 'Pending'  },
  ],
  role: [
    { path: 'Admin',  label: 'Admin'  },
    { path: 'Editor', label: 'Editor' },
    { path: 'User',   label: 'User'   },
  ],
};

export default function Example() {
  const [filters, setFilters] = useState(null);

  const filteredData = useMemo(() => {
    if (!filters) return MOCK_DATA;
    return applyFilterFn(MOCK_DATA, filters);
  }, [filters]);

  return (
    <div>
      <FilterPopover
        filterData={FILTER_DATA}
        options={OPTIONS}
        keysMeta={KEYS_META}
        filters={filters}
        updateFilters={setFilters}
        defaultCondition={{
          key: 'amount',
          operator: '<=',
          value: 200,
        }}
      />

      {filteredData.map((row, i) => (
        <div key={i}>{row.name} — {row.status}</div>
      ))}
    </div>
  );
}
```

---

## Props

| Prop               | Type       | Default | Description                                                    |
|--------------------|------------|---------|----------------------------------------------------------------|
| `filterData`       | `object`   | required| Schema with `fields` and `types` — NOT your raw data array     |
| `keysMeta`         | `object`   | required| Maps each field path to `{ label, type, multiple? }`           |
| `options`          | `object`   | `{}`    | Select options map `{ [path]: [{ path, label }] }`             |
| `filters`          | `object`   | `null`  | Controlled filter state                                        |
| `updateFilters`    | `function` | required| Called with backend filter format on Apply                     |
| `defaultCondition` | `object`   | —       | Pre-populates first condition `{ key, operator, value }`       |
| `filterProps`      | `object`   | —       | Alternative: pass all props as a single object (new API)       |

---

## `filterProps` API (alternative)

Instead of passing props individually you can bundle them into a single `filterProps` object:
```jsx
const filterProps = {
  filterData: FILTER_DATA,
  options: OPTIONS,
  keysMeta: KEYS_META,
  filters,
  updateFilters: setFilters,
  defaultCondition: { key: 'amount', operator: '<=', value: 200 },
};

<FilterPopover filterProps={filterProps} />
```

> `filterProps` takes precedence over individually passed props when both are provided.

---

## Theming

FilterPopover uses CSS custom properties for theming. Add any of these to your `globals.css`. All variables have fallback defaults so you only need to override what you want to change.
```css
:root {
  --filter-primary:          #4f46e5;  /* main brand color — button, icons, border accent */
  --filter-primary-hover:    #4338ca;  /* button hover state */
  --filter-primary-text:     #ffffff;  /* text on primary colored backgrounds */
  --filter-add-hover:        #4338ca;


  --filter-bg:               #f9fafb;  /* popover background */
  --filter-bg-group:         #f3f4f6;  /* condition group background */

  --filter-border:           #e5e7eb;  /* borders and dividers */
  --filter-border-top:       #4f46e5;  /* popover top accent border */

  --filter-text:             #1e293b;  /* primary text */
  --filter-text-muted:       #6b7280;  /* secondary text, placeholders */
  --filter-text-placeholder: #9ca3af;  /* input placeholder text */

  --filter-input-border:     #d1d5db;  /* input and select border color */

  --filter-badge-bg:         #4f46e5;  /* active filter count badge background */
  --filter-badge-text:       #ffffff;  /* active filter count badge text */

  --filter-radius:           2px;      /* border radius */
}
```

---

## Nesting

Conditions can be nested up to **3 levels deep** using condition groups. Each group has its own AND/OR logic selector.

---

## Peer Dependencies

| Package     | Version  |
|-------------|----------|
| `react`     | `>=18`   |
| `react-dom` | `>=18`   |