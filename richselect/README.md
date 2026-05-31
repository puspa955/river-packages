# RichSelect

A flexible, theme-aware dropdown select component for React. Supports single select, multi-select, search, grouped options, tooltips, and full CSS variable theming.

---

## Installation

```bash
npm install git+https://github.com/puspa955/river-packages.git#main
```

See the [root README](../README.md) for required project setup — `next.config.js`, `tailwind.config.js`, and Font Awesome CSS must all be configured before this component will work correctly.

---

## Peer Dependencies

| Package | Version |
|---|---|
| `react` | `>=18` |
| `react-dom` | `>=18` |
| `tailwindcss` | `>=3` |
| `@fortawesome/fontawesome-svg-core` | `>=6` |
| `@fortawesome/free-solid-svg-icons` | `>=6` |
| `@fortawesome/react-fontawesome` | `>=0.2` |

---

## Usage

```jsx
import { RichSelect } from '@ankamala/ui-libraries/richselect';
import { useState } from 'react';

const options = [
  { label: 'Source',   path: 'source'   },
  { label: 'Name',     path: 'name'     },
  { label: 'Category', path: 'category' },
];

export default function Example() {
  const [selected, setSelected] = useState(null);

  return (
    <RichSelect
      selected={selected}
      onSelect={setSelected}
      options={options}
      trigger={(selected) => (
        <button className="border px-3 py-1 rounded text-sm">
          {selected?.label || 'Select...'}
        </button>
      )}
    />
  );
}
```

---

## Options Format

Each option must have a `label` and a `path`.

```js
const options = [
  { label: 'Display Name', path: 'unique.key' },
];
```

| Field | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | yes | Text displayed in the dropdown |
| `path` | `string` | yes | Unique identifier used as the option value |

> **Important:** `path` must be unique across all options including nested ones — it is used internally to track selection state.

### Grouped Options

```js
const grouped = [
  {
    label: 'Location',
    options: [
      { label: 'City',    path: 'location.city'    },
      { label: 'Country', path: 'location.country' },
    ],
  },
  { label: 'Name', path: 'name' },
];
```

### Loading State

```js
const options = [
  { label: 'Loading...', path: 'loading', isLoading: true },
];
```

---

## Examples

### Single Select

```jsx
const [selected, setSelected] = useState(null);

<RichSelect
  selected={selected}
  onSelect={setSelected}
  options={options}
  trigger={(selected) => (
    <button className="border px-3 py-1 rounded text-sm">
      {selected?.label || 'Select...'}
    </button>
  )}
/>
```

### Multi Select

```jsx
const [selected, setSelected] = useState([]);

<RichSelect
  multiple
  selected={selected}
  onSelect={setSelected}
  options={options}
  trigger={(selected) => (
    <button className="border px-3 py-1 rounded text-sm">
      {selected.length > 0 ? `${selected.length} selected` : 'Select fields'}
    </button>
  )}
/>
```

### Multi Select with Selected Summary

When `options.length > 6`, the selected tags summary shows automatically. To always show it:

```jsx
<RichSelect
  multiple
  showSelectedSummary="always"
  selected={selected}
  onSelect={setSelected}
  options={options}
  trigger={(selected) => (
    <button className="border px-3 py-1 rounded text-sm">
      {selected.length > 0 ? `${selected.length} selected` : 'Select fields'}
    </button>
  )}
/>
```

### With Tooltip per Option

```jsx
// Function
<RichSelect
  optionTooltip={(option) => `Filter by ${option.label}`}
  ...
/>

// Object keyed by path
<RichSelect
  optionTooltip={{
    'source': 'The data source',
    'name':   'Filter by name',
  }}
  ...
/>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `array` | required | List of `{ label, path }` objects. Supports nested groups via `options` key |
| `selected` | `object / array` | `[]` | Selected option(s) |
| `onSelect` | `function` | required | Called with selected option(s) on change |
| `trigger` | `function` | — | Render prop for the trigger button `(selected) => JSX` |
| `multiple` | `boolean` | `false` | Enable multi-select |
| `isSearchable` | `boolean` | `true` | Show search input |
| `isSmall` | `boolean` | `false` | Compact trigger style with no border |
| `isShadow` | `boolean` | `true` | Show popover shadow |
| `showSelectedSummary` | `boolean / "always"` | `true` | Show selected tags in multi-select. `true` shows when options > 6, `"always"` forces it |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder for search input |
| `shouldFilter` | `boolean` | `true` | Enable built-in search filtering |
| `searchFields` | `array` | `['label']` | Option fields to search against |
| `optionTooltip` | `function / object` | — | Tooltip per option. Function `(option) => string` or object `{ [path]: string }` |
| `className` | `string` | — | Additional class for the wrapper div |

---

## Theming

RichSelect uses CSS custom properties for theming. Add any of these to your `globals.css` to match your app's design system. All variables have sensible defaults so you only need to set what you want to override.

```css
:root {
  --rs-accent:        #6366f1;   /* primary color — selected state, checkmark, tags */
  --rs-accent-bg:     #eef2ff;   /* light accent background — selected item bg, tag bg */
  --rs-accent-hover:  #e0e7ff;   /* accent hover — tag hover background */
  --rs-border:        #f3f4f6;   /* border color — item dividers, popover border, input border */
  --rs-text:          #111827;   /* primary text — option labels */
  --rs-text-muted:    #6b7280;   /* secondary text — placeholder, empty state */
  --rs-bg:            #ffffff;   /* popover background */
  --rs-bg-hover:      #f9fafb;   /* item hover background */
  --rs-selected-bg:   #eef2ff;   /* selected item background (defaults to --rs-accent-bg) */
  --rs-check-color:   #6366f1;   /* checkmark icon color (defaults to --rs-accent) */
  --rs-tag-bg:        #eef2ff;   /* selected tag background in multi-select summary */
  --rs-tag-text:      #6366f1;   /* selected tag text in multi-select summary */
  --rs-radius:        6px;       /* border radius — tags only (see note below) */
  --rs-font-size:     0.875rem;  /* font size for group headings */
  --rs-font-size-tag: 10px;      /* font size for multi-select tags */
}
```

### Trigger Theming

The trigger button is fully controlled by you via the `trigger` prop. Use `--rs-*` variables there too if you want it to match the theme:

```jsx
trigger={(selected) => (
  <button
    style={{ color: 'var(--rs-text)', borderColor: 'var(--rs-border)' }}
    className="border px-3 py-1 rounded text-sm"
  >
    {selected?.label || 'Select...'}
  </button>
)}
```

### Notes

- `--rs-accent` is the most important variable — it controls the primary color throughout.
- `--rs-selected-bg`, `--rs-check-color`, `--rs-tag-bg`, and `--rs-tag-text` follow `--rs-accent` and `--rs-accent-bg` automatically if not set separately.
- **Font family** inherits from your app automatically if set on `html` or `body`. If your app sets it on a scoped selector like `#root` (common in React), the dropdown portal won't inherit it — set it explicitly on `[data-radix-popper-content-wrapper]`.
- **Font size** for list items inherits from your app. Group headings and tags use `--rs-font-size` and `--rs-font-size-tag` respectively.
- `--rs-radius` controls the multi-select tag border radius. For the **popover** border radius, set it directly in your app's CSS:
  ```css
  [data-radix-popper-content-wrapper] > div {
    border-radius: 4px;
  }
  ```