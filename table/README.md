# DataTable

A flexible, theme-aware data table component for React. Supports sorting, pagination, search, and filter integration with async data fetching, zebra striping, sticky headers, and clickable rows.

---

## Installation
```bash
npm install git+https://github.com/puspa955/river-packages.git#table
```

---

## Usage
```jsx
import { DataTable } from '@ankamala/table';

export default function Example() {
  return (
    <DataTable
      data={MY_DATA}
      columns={COLUMNS}
      tableTitle="Users"
    />
  );
}
```

---

## Data Contracts

### `data`
Either a static array of row objects or a URL string to fetch from. When a URL is provided, the component fetches on mount and handles loading/error states automatically.

```js
// Static array
const data = [
  { id: 1, name: 'Alice', status: 'active',   amount: 120 },
  { id: 2, name: 'Bob',   status: 'inactive', amount: 85  },
];

// Or a URL — the component fetches and normalizes automatically
const data = 'https://api.example.com/users';
```

When fetching from a URL, the component automatically unwraps common response shapes:

| Response shape                        | Extracted as       |
|---------------------------------------|--------------------|
| `[...]`                               | Array directly     |
| `{ data: [...] }`                     | `data`             |
| `{ results: [...] }`                  | `results`          |
| `{ items: [...] }`                    | `items`            |
| `{ list: [...] }`, `{ rows: [...] }`  | `list` / `rows`    |
| `{ records: [...] }`                  | `records`          |
| Any single object                     | Wrapped in `[obj]` |

---

### `columns`
Column definitions following the [TanStack Table v8](https://tanstack.com/table/v8) `ColumnDef` format.

```jsx
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue()}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const colorMap = {
        active:   'bg-green-100 text-green-700',
        inactive: 'bg-gray-100 text-gray-600',
        pending:  'bg-yellow-100 text-yellow-700',
      };
      return (
        <span className={`inline-flex px-3 py-1 rounded-sm text-xs font-medium ${colorMap[getValue()]}`}>
          {getValue()}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) => `$${getValue()}`,
  },
];
```

---

### `filterConfig`
Defines the filterable fields, their types, and an optional pre-populated default condition. Pass this alongside `enableFilter` to activate the filter popover.

```js
const filterConfig = {
  fields: [
    { label: 'Name',   path: 'name',     type: 'string'  },
    { label: 'Status', path: 'status',   type: 'select'  },
    { label: 'Amount', path: 'amount',   type: 'number'  },
    { label: 'Active', path: 'isActive', type: 'boolean' },
  ],
  defaultCondition: {
    key:      'amount',
    operator: '<=',
    value:    '200',
  },
};
```

Each entry in `fields`:

| Field   | Type     | Required | Description                          |
|---------|----------|----------|--------------------------------------|
| `label` | `string` | yes      | Display label shown in the filter UI |
| `path`  | `string` | yes      | Key in the row data object           |
| `type`  | `string` | yes      | One of the supported types below     |

**Supported types:**

| Type      | Operators                           | Input        |
|-----------|-------------------------------------|--------------|
| `string`  | `=`, `!=`, `contains`, `beginswith` | Text input   |
| `number`  | `=`, `!=`, `<`, `>`, `<=`, `>=`    | Number input |
| `select`  | `=`, `!=`                           | Dropdown     |
| `boolean` | `=`, `!=`                           | Toggle       |
| `date`    | `=`, `!=`, `<`, `>`, `<=`, `>=`    | Date picker  |

For `select` type fields, unique option values are generated automatically from your data — you do not need to provide them manually.

`defaultCondition` is optional. When provided, it pre-populates the first condition row when the filter popover opens.

---

## Props

| Prop                 | Type              | Default        | Description                                                      |
|----------------------|-------------------|----------------|------------------------------------------------------------------|
| `data`               | `array \| string` | required       | Row data array or URL to fetch from                              |
| `columns`            | `array`           | `[]`           | TanStack Table v8 column definitions                             |
| `tableTitle`         | `string`          | `"Data"`       | Title shown in the header bar                                    |
| `tableSubtitle`      | `string`          | —              | Optional subtitle shown below the title                          |
| `enableSorting`      | `boolean`         | `true`         | Enables column sorting with click-to-sort headers                |
| `enablePagination`   | `boolean`         | `true`         | Enables pagination controls in the footer                        |
| `enableSearch`       | `boolean`         | `false`        | Shows a global search bar in the header                          |
| `enableFilter`       | `boolean`         | `false`        | Shows the filter popover button in the header                    |
| `searchPlaceholder`  | `string`          | `"Search..."` | Placeholder text for the search input                            |
| `filterConfig`       | `object`          | `null`         | Filter schema — see [`filterConfig`](#filterconfig) above        |
| `pageSize`           | `number`          | `10`           | Initial number of rows per page                                  |
| `rowsPerPageOptions` | `number[]`        | `[5,10,25,50]` | Options shown in the rows-per-page dropdown                      |
| `onRowClick`         | `function`        | —              | Called with the row's original data object when a row is clicked |
| `className`          | `string`          | `""`           | Additional class names applied to the outer wrapper              |
| `stickyHeader`       | `boolean`         | `false`        | Fixes the header while the table body scrolls (max height 600px) |
| `zebraStripes`       | `boolean`         | `false`        | Alternates background color on odd rows                          |
| `emptyMessage`       | `string`          | —              | Custom message shown in the empty state when there is no data    |

---

## Full Example

```jsx
import { DataTable } from '@ankamala/table';

const MOCK_DATA = [
  { name: 'Alice', status: 'active',   role: 'Admin',  amount: 120, isActive: true  },
  { name: 'Bob',   status: 'inactive', role: 'User',   amount: 85,  isActive: false },
  { name: 'Carol', status: 'pending',  role: 'Editor', amount: 200, isActive: true  },
];

const COLUMNS = [
  { accessorKey: 'name',     header: 'Name'   },
  { accessorKey: 'status',   header: 'Status' },
  { accessorKey: 'role',     header: 'Role'   },
  { accessorKey: 'amount',   header: 'Amount', cell: ({ getValue }) => `$${getValue()}` },
  { accessorKey: 'isActive', header: 'Active', cell: ({ getValue }) => getValue() ? 'Yes' : 'No' },
];

const FILTER_CONFIG = {
  fields: [
    { label: 'Name',   path: 'name',     type: 'string'  },
    { label: 'Status', path: 'status',   type: 'select'  },
    { label: 'Amount', path: 'amount',   type: 'number'  },
    { label: 'Active', path: 'isActive', type: 'boolean' },
  ],
  defaultCondition: {
    key:      'amount',
    operator: '<=',
    value:    '200',
  },
};

export default function Example() {
  return (
    <DataTable
      data={MOCK_DATA}
      columns={COLUMNS}
      tableTitle="Team Members"
      tableSubtitle="All active users across roles"
      enableSearch
      enableFilter
      enableSorting
      enablePagination
      filterConfig={FILTER_CONFIG}
      pageSize={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
      zebraStripes
      onRowClick={(row) => console.log('Clicked:', row)}
    />
  );
}
```

---

## Async Data Example

```jsx
const FILTER_CONFIG = {
  fields: [
    { label: 'Gender',       path: 'gender',       type: 'select' },
    { label: 'Title',        path: 'title',        type: 'select' },
    { label: 'Name',         path: 'name',         type: 'string' },
    { label: 'Completeness', path: 'completeness', type: 'number' },
  ],
  defaultCondition: {
    key:      'completeness',
    operator: '<=',
    value:    '0.5',
  },
};

<DataTable
  data="https://api.example.com/people"
  columns={COLUMNS}
  tableTitle="People Directory"
  tableSubtitle="View people records"
  enableSearch
  enableFilter
  enablePagination
  searchPlaceholder="Search people..."
  filterConfig={FILTER_CONFIG}
  pageSize={10}
  onRowClick={(row) => console.log('Clicked:', row)}
/>
```

Loading and error states are handled automatically. The error state includes a retry button that re-triggers the fetch.

---

## Theming

`DataTable` uses CSS custom properties for theming. The table and its built-in filter popover each have their own variable sets. Add any of these to your `globals.css` — all variables have fallback defaults so you only need to override what you want to change.

### Table variables

```css
:root {
  /* ── Brand / Primary ──────────────────────────── */
  --table-primary:        #4f46e5;  /* active sort icons, active page button, spinner, buttons */
  --table-primary-hover:  #4338ca;  /* button hover state */
  --table-primary-light:  rgba(238, 242, 255, 0.5); /* clickable row hover */
  --table-primary-text:   #ffffff;  /* text on primary colored backgrounds */
  --table-primary-border: rgba(99, 102, 241, 0.5);  /* focus ring */

  /* ── Surfaces ─────────────────────────────────── */
  --table-bg:                   #ffffff;  /* main table background */
  --table-header-bg:            #f8fafc;  /* title bar and thead */
  --table-footer-bg:            #f8fafc;  /* pagination bar */
  --table-row-hover-bg:         rgba(238, 242, 255, 0.5); /* clickable row hover */
  --table-row-hover-bg-neutral: rgba(248, 250, 252, 0.5); /* non-clickable row hover */
  --table-row-stripe-bg:        rgba(248, 250, 252, 0.4); /* zebra odd rows */

  /* ── Borders & Shadows ────────────────────────── */
  --table-border:         #e2e8f0;  /* card border and pagination buttons */
  --table-border-header:  #e2e8f0;  /* thead bottom border */
  --table-border-row:     #f1f5f9;  /* tbody row divider */
  --table-shadow:         0 4px 6px -1px rgb(0 0 0 / 0.1),
                          0 2px 4px -2px rgb(0 0 0 / 0.1);
  --table-radius:         2px;

  /* ── Text ─────────────────────────────────────── */
  --table-text-primary:   #0f172a;  /* title and headings */
  --table-text-secondary: #334155;  /* cell text */
  --table-text-muted:     #64748b;  /* subtitles, counts, placeholders */
  --table-text-header:    #334155;  /* column header labels */

  /* ── States ───────────────────────────────────── */
  --table-empty-bg:       #f8fafc;
  --table-empty-icon:     #94a3b8;
  --table-error-bg:       #fef2f2;
  --table-error-icon:     #dc2626;
  --table-loading-track:  #e2e8f0;

  /* ── Controls ─────────────────────────────────── */
  --table-input-border:   #cbd5e1;
  --table-input-focus:    rgba(99, 102, 241, 0.5);
  --table-btn-bg:         #ffffff;
  --table-btn-hover-bg:   #f8fafc;
}
```

### Filter variables

These control the filter popover that appears when `enableFilter` is set.

```css
:root {
  /* ── Brand / Primary ──────────────────────────── */
  --filter-primary:          #4f46e5;  /* button, active icons, top accent border */
  --filter-primary-hover:    #4338ca;  /* button hover state */
  --filter-primary-text:     #ffffff;  /* text on primary colored backgrounds */

  /* ── Surfaces ─────────────────────────────────── */
  --filter-bg:               #f9fafb;  /* popover background */
  --filter-bg-group:         #f3f4f6;  /* condition group background */

  /* ── Borders ──────────────────────────────────── */
  --filter-border:           #e5e7eb;  /* borders and dividers */
  --filter-border-top:       #4f46e5;  /* popover top accent border */

  /* ── Text ─────────────────────────────────────── */
  --filter-text:             #1e293b;  /* primary text */
  --filter-text-muted:       #6b7280;  /* secondary text */
  --filter-text-placeholder: #9ca3af;  /* input placeholder text */

  /* ── Controls ─────────────────────────────────── */
  --filter-input-border:     #d1d5db;  /* input and select border */

  /* ── Badge ────────────────────────────────────── */
  --filter-badge-bg:         #4f46e5;  /* active filter count badge background */
  --filter-badge-text:       #ffffff;  /* active filter count badge text */

  --filter-radius:           2px;
}
```

---

## Peer Dependencies

| Package                 | Version |
|-------------------------|---------|
| `react`                 | `>=18`  |
| `react-dom`             | `>=18`  |
| `@tanstack/react-table` | `>=8`   |
| `lucide-react`          | `>=0.3` |