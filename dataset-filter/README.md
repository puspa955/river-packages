# Dataset Filter

A flexible, theme-aware dataset filter component for React. Renders a sticky sidebar filter panel with search, checkboxes, range buckets, and nested groups. Supports static arrays, remote URLs, and custom fetch functions.

---

## Installation
```bash
npm install git+https://github.com/puspa955/river-packages.git#main
```

---

## Usage

```jsx
import { DatasetFilter } from '@ankamala/ui-libraries/dataset-filter';
```

`DatasetFilter` takes a `schema` that defines your filters, a data source, and a `renderContent` render prop that receives the filtered results.

```jsx
<DatasetFilter
  schema={SCHEMA}
  data={MY_DATA}
  renderContent={({ filteredData, totalData }) => (
    <div>
      <p>{filteredData.length} of {totalData.length} results</p>
      {filteredData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )}
/>
```

---

## Data Sources

Three mutually exclusive modes — pick one.

### A — Static array

Pass a plain JS array via `data`. No fetching, renders immediately.

```jsx
<DatasetFilter
  schema={SCHEMA}
  data={SAMPLE_JOBS}
  renderContent={renderJobContent}
  enableUrlSync={true}
/>
```

### B — Remote URL

Pass a JSON endpoint via `dataset`. Fetched and cached internally via React Query.

```jsx
<DatasetFilter
  schema={SCHEMA}
  dataset="https://api.example.com/items"
  dataTransform={(result) => result.data}
  renderContent={renderJobContent}
/>
```

### C — Custom queryFn

Full control over fetching — useful for auth headers, POST bodies, etc.

```jsx
const myQueryFn = async () => {
  const res = await fetch('https://api.example.com/items');
  const data = await res.json();
  return data; // return already-transformed data
};

<DatasetFilter
  schema={SCHEMA}
  queryFn={myQueryFn}
  queryKey={['my-items']}
  renderContent={renderJobContent}
/>
```

---

## Schema

The schema is a plain object — each key is a filter id, each value defines the filter type and config.

### `search`

Full-text search across one or more fields. Renders a search input above the results.

```js
search: {
  type: 'search',
  placeholder: 'Search by title, company or tag…',
  fields: ['title', 'company', 'tags'],
},
```

### `checkbox`

A single boolean toggle. Automatically grouped under a **General** section in the sidebar.

```js
remote: {
  type: 'checkbox',
  label: 'Remote only',
  field: 'remote',
},
```

### `checkbox-group`

Multi-select list. Options can be hardcoded or auto-extracted from the data by omitting `options`.

```js
// hardcoded options
type: {
  type: 'checkbox-group',
  label: 'Employment type',
  field: 'type',
  options: ['Full-time', 'Part-time', 'Contract'],
},

// auto-extracted from data
location: {
  type: 'checkbox-group',
  label: 'Location',
  field: 'location',
},

// array field per item — set isArray: true
tags: {
  type: 'checkbox-group',
  label: 'Tech Stack',
  field: 'tags',
  isArray: true,
},
```

### `range`

Bucket-based range filter. Each bucket defines a `min` and `max`.

```js
salary: {
  type: 'range',
  label: 'Salary (USD)',
  field: 'salary',
  ranges: [
    { label: '< $100k',       min: 0,      max: 99999   },
    { label: '$100k – $130k', min: 100000, max: 130000  },
    { label: '$130k – $150k', min: 130001, max: 150000  },
    { label: '> $150k',       min: 150001, max: Infinity },
  ],
},
```

### `group`

Wraps multiple filters under a single collapsible section. Children support `checkbox-group` and `range` only.

```js
jobDetails: {
  type: 'group',
  label: 'Job Details',
  children: ['type', 'location'],
  childrenSchema: {
    type: {
      type: 'checkbox-group',
      label: 'Employment type',
      field: 'type',
      options: ['Full-time', 'Part-time', 'Contract'],
    },
    location: {
      type: 'checkbox-group',
      label: 'Location',
      field: 'location',
    },
  },
},
```

---

## Props

| Prop            | Type       | Default  | Description                                                        |
|-----------------|------------|----------|--------------------------------------------------------------------|
| `schema`        | `object`   | required | Filter schema definition                                           |
| `data`          | `array`    | `null`   | Static data array                                                  |
| `dataset`       | `string`   | `null`   | Remote JSON URL to fetch                                           |
| `queryFn`       | `function` | `null`   | Custom async fetch function                                        |
| `queryKey`      | `array`    | auto     | React Query cache key (required when using `queryFn`)              |
| `dataTransform` | `function` | `null`   | Transform fetched data before filtering. Receives raw fetch result |
| `renderContent` | `function` | —        | Render prop — receives `{ filteredData, totalData, filters }`      |
| `enableUrlSync` | `boolean`  | `true`   | Sync active filters to `?f=` URL param                             |
| `queryOptions`  | `object`   | `{}`     | Extra options passed directly to React Query's `useQuery`          |
| `className`     | `string`   | `""`     | Class name on the root wrapper                                     |
| `style`         | `object`   | `{}`     | Inline style on the root wrapper                                   |

---

## `renderContent`

Receives three values:

```js
renderContent={({ filteredData, totalData, filters }) => (
  // filteredData — items after all active filters applied
  // totalData    — full unfiltered source array
  // filters      — current active filter state object
)}
```

---

## Full Example

```jsx
import { DatasetFilter } from '@ankamala/ui-libraries/dataset-filter';

const SAMPLE_JOBS = [
  { id: 1,  title: 'Frontend Engineer', company: 'Stripe',     location: 'Remote',        salary: 130000, type: 'Full-time', remote: true,  tags: ['React', 'TypeScript'] },
  { id: 2,  title: 'Backend Engineer',  company: 'Vercel',     location: 'San Francisco', salary: 145000, type: 'Full-time', remote: false, tags: ['Node.js', 'Go'] },
  { id: 3,  title: 'Product Designer',  company: 'Linear',     location: 'Remote',        salary: 115000, type: 'Full-time', remote: true,  tags: ['Figma', 'UX'] },
  { id: 4,  title: 'ML Engineer',       company: 'Anthropic',  location: 'San Francisco', salary: 180000, type: 'Full-time', remote: false, tags: ['Python', 'PyTorch'] },
];

const JOB_SCHEMA = {
  search: {
    type: 'search',
    placeholder: 'Search by title, company or tag…',
    fields: ['title', 'company', 'tags'],
  },
  remote: {
    type: 'checkbox',
    label: 'Remote only',
    field: 'remote',
  },
  jobDetails: {
    type: 'group',
    label: 'Job Details',
    children: ['type', 'location'],
    childrenSchema: {
      type: {
        type: 'checkbox-group',
        label: 'Employment type',
        field: 'type',
        options: ['Full-time', 'Part-time', 'Contract'],
      },
      location: {
        type: 'checkbox-group',
        label: 'Location',
        field: 'location',
        // omit options — auto-extracted from data
      },
    },
  },
  salary: {
    type: 'range',
    label: 'Salary (USD)',
    field: 'salary',
    ranges: [
      { label: '< $100k',       min: 0,      max: 99999   },
      { label: '$100k – $130k', min: 100000, max: 130000  },
      { label: '$130k – $150k', min: 130001, max: 150000  },
      { label: '> $150k',       min: 150001, max: Infinity },
    ],
  },
  tags: {
    type: 'checkbox-group',
    label: 'Tech Stack',
    field: 'tags',
    isArray: true,
    // omit options — auto-extracted from data
  },
};

const JobCard = ({ job }) => (
  <div>
    <h3>{job.title}</h3>
    <p>{job.company} · {job.location}</p>
    <p>${job.salary.toLocaleString()} / yr · {job.type}</p>
  </div>
);

export default function JobsPage() {
  return (
    <DatasetFilter
      schema={JOB_SCHEMA}
      data={SAMPLE_JOBS}
      enableUrlSync={true}
      renderContent={({ filteredData, totalData }) => (
        <div>
          <p>Showing {filteredData.length} of {totalData.length} jobs</p>
          {filteredData.length === 0 ? (
            <p>No jobs match your filters</p>
          ) : (
            filteredData.map(job => <JobCard key={job.id} job={job} />)
          )}
        </div>
      )}
    />
  );
}
```

---

## Theming

All variables have hardcoded fallback defaults — the component looks correct with zero setup. Override only what you need.

```css
:root {
  --dsf-primary:        #3b6fd4;  /* checkboxes, focus ring, icons, hover text */
  --dsf-primary-hover:  #2d5bbf;  /* hover state of primary elements */
  --dsf-primary-light:  #eff4ff;  /* focus ring glow */
  --dsf-primary-text:   #1e3fa8;  /* text on light primary backgrounds */

  --dsf-border:         #e2e5ea;  /* panel border, section dividers, input border */
  --dsf-border-focus:   #3b6fd4;  /* input border when focused */

  --dsf-bg-panel:       #ffffff;  /* filter sidebar background */
  --dsf-bg-page:        #f5f6f8;  /* main page background */

  --dsf-text-primary:   #0f1923;  /* checkbox labels, headings */
  --dsf-text-secondary: #52616b;  /* section headers, loading text */
  --dsf-text-muted:     #8e99a4;  /* icons, placeholders, chevrons */

  --dsf-badge-bg:       #eff4ff;  /* active filter badge background */
  --dsf-badge-text:     #1e3fa8;  /* active filter badge text */
  --dsf-badge-border:   #c0d0f5;  /* active filter badge border */

  --dsf-radius:         5px;      /* border radius on inputs, badges, error box */
  --dsf-panel-width:    272px;    /* filter sidebar width */
  --dsf-font:           -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

Scope overrides to a single page:

```css
.my-page {
  --dsf-primary:       #e11d48;
  --dsf-primary-hover: #be123c;
  --dsf-primary-light: #fff1f2;
  --dsf-primary-text:  #9f1239;
  --dsf-border-focus:  #e11d48;
  --dsf-badge-bg:      #fff1f2;
  --dsf-badge-text:    #9f1239;
  --dsf-badge-border:  #fecdd3;
}
```

---

## Next.js Setup

Add this to `next.config.js` to prevent duplicate React errors when linking the package locally:

```js
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react':                 resolve(__dirname, 'node_modules/react'),
      'react-dom':             resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime':     resolve(__dirname, 'node_modules/react/jsx-runtime'),
      '@tanstack/react-query': resolve(__dirname, 'node_modules/@tanstack/react-query'),
    };
    return config;
  },
  transpilePackages: ['@ankamala/ui-libraries'],
};

export default nextConfig;
```

---

## Peer Dependencies

| Package                 | Version |
|-------------------------|---------|
| `react`                 | `>=18`  |
| `react-dom`             | `>=18`  |
| `@tanstack/react-query` | `>=5`   |