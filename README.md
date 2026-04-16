# @ankamala/ui-libraries

A collection of reusable React UI components for internal use across company projects. Includes a dataset filter panel, a filter popover, and a rich select dropdown — all theme-aware and built for Next.js apps with Tailwind CSS.

---

## Packages

| Package | Import path | Description |
|---|---|---|
| `DatasetFilter` | `@ankamala/ui-libraries/dataset-filter` | Sticky sidebar filter panel with search, checkboxes, and range buckets |
| `FilterPopover` | `@ankamala/ui-libraries/filter` | Popover-based filter builder with nested AND/OR condition groups |
| `RichSelect` | `@ankamala/ui-libraries/richselect` | Flexible dropdown with single/multi-select, search, and grouped options |

---

## Installation

```bash
npm install git+https://github.com/puspa955/river-packages.git#main
```

---

## Project Requirements

This library is designed for **Next.js** projects using **Tailwind CSS**. The following must already be installed and configured in your project before using any component from this library.

### Peer Dependencies

| Package | Version | Required by |
|---|---|---|
| `react` | `>=18` | All |
| `react-dom` | `>=18` | All |
| `next` | `>=13` | All |
| `tailwindcss` | `>=3` | All |
| `@tanstack/react-query` | `>=5` | `DatasetFilter` |
| `@fortawesome/fontawesome-svg-core` | `>=6` | `FilterPopover`, `RichSelect` |
| `@fortawesome/free-solid-svg-icons` | `>=6` | `FilterPopover`, `RichSelect` |
| `@fortawesome/react-fontawesome` | `>=0.2` | `FilterPopover`, `RichSelect` |

Install any missing peer dependencies:

```bash
npm install @tanstack/react-query
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

---

## Required Setup

After installation, three things need to be configured in every project that uses this library.

### 1. `next.config.js`

Add webpack aliases to prevent duplicate React and React Query instances, and add the library packages to `transpilePackages`:

```js
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
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
  transpilePackages: ['dayjs', '@ankamala/filter', '@ankamala/select', '@ankamala/core'],
};

export default nextConfig;
```

> **Why?** When the library is linked locally or installed from Git, Node.js can resolve a separate copy of React or React Query inside the package. The webpack aliases force all code to share a single instance, preventing "invalid hook call" and context mismatch errors.

### 2. `tailwind.config.js`

Add the library's source files to Tailwind's `content` array so its classes are not purged in production:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@ankamala/**/*.{js,ts,jsx,tsx}", // <-- add this
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

> **Why?** Tailwind only includes CSS classes it finds at build time. Without this line, any Tailwind class used inside the library components will be stripped from the production bundle and the UI will break.

### 3. Font Awesome CSS

Import the Font Awesome core styles once in your app's root layout or `_app` file. Without this, icons will render at full size before the stylesheet loads (the "flash of unstyled icons" problem).

```js
// app/layout.js  (Next.js App Router)
// pages/_app.js  (Next.js Pages Router)

import "@fortawesome/fontawesome-svg-core/styles.css";
```

Also add this to your Font Awesome config if you have one, to prevent Next.js from injecting duplicate styles:

```js
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
```

---

## Quick Start

Once the setup above is complete, import and use any component directly:

```jsx
import { DatasetFilter } from '@ankamala/ui-libraries/dataset-filter';
import { FilterPopover, applyFilterFn } from '@ankamala/ui-libraries/filter';
import { RichSelect } from '@ankamala/ui-libraries/richselect';
```

See each component's README for full usage documentation:

- [DatasetFilter](./dataset-filter/README.md)
- [FilterPopover](./filter/README.md)
- [RichSelect](./richselect/README.md)

---

## Theming

All three components are theme-aware via CSS custom properties. Each component exposes its own set of `--dsf-*`, `--filter-*`, or `--rs-*` variables. Add overrides to your `globals.css`:

```css
:root {
  /* DatasetFilter */
  --dsf-primary: #e11d48;

  /* FilterPopover */
  --filter-primary: #e11d48;

  /* RichSelect */
  --rs-accent: #e11d48;
}
```

All variables have sensible defaults — zero configuration is needed to get a working UI out of the box. See each component's README for the full variable reference.