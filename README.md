# @withwiz/ui

UI components for withwiz projects, **namespaced by platform**. Imports look like
`@withwiz/ui/<platform>/...`, e.g. `@withwiz/ui/react/components/ui/data-table`.

This package is not React-only. React is the first supported platform; other platforms
(e.g. `@withwiz/ui/react-native`, `@withwiz/ui/vue`) can be added under the same scheme
without restructuring consumers.

## Platforms

All peer dependencies are **optional at the package level** and required only by the
platform you actually import.

### `react` (`@withwiz/ui/react/*`)
Requires:
- `react >=18`, `react-dom >=18`
- `@withwiz/toolkit >=0.8.0` — three modules (`react/utils/qr-code`,
  `react/hooks/useTimezone`, `react/error/error-display`) import `@withwiz/toolkit/core/*`.
  This is the allowed dependency direction (toolkit is the base layer).
- `next >=15` — only for the SSR-aware pieces.

Styling is unchanged from the toolkit version: components render Tailwind utility classes
with shadcn design tokens. Consumers provide a Tailwind + shadcn theme, exactly as before.
No CSS is shipped.

## Modules (`react` platform)

Everything is imported per-file under `@withwiz/ui/react/*`:

| Area | Import root | Contents |
|------|-------------|----------|
| Components | `react/components/ui/*` | `Alert`, `Badge`, `Button`, `Input`, `Label`, `Select`, `Tooltip`, `Skeleton`, `Pagination`, `loading-bar`, `TimezoneDisplay`, `DomainDisplay`, `DataTable` — see [components/README.md](./src/react/components/README.md) |
| DataTable | `react/components/ui/data-table` | `DataTable` + sub-components, `ColumnDef`/`BulkAction`/`FilterConfig`/… types, `DEFAULT_LABELS`, `formatLabel` |
| Hooks | `react/hooks/*` | `useDataTable`, `useDebounce`, `useTimezone` (+`useSimpleTimezone`), `useExitIntent` — see [hooks/README.md](./src/react/hooks/README.md) |
| Utils | `react/utils/client-utils` | `cn(...)` (clsx + tailwind-merge), `copyToClipboard(text)` |
| Utils | `react/utils/qr-code` | `DEFAULT_QR_SETTINGS`, `QR_CODE_TEMPLATES`, `applyUserBrandToQRSettings`, `downloadQRCode`, `downloadQRCodeWithLogo`, `generateQRCodeUrl`, `loadQRSettings`, `saveQRSettings` |
| Error | `react/error` / `react/error/error-display` | `sonner`-based toasts: `showFriendlyError`, `handleApiResponse`, `formatInlineError`, `getErrorIcon`, `getDefaultErrorCode` + re-exports from `@withwiz/toolkit/core/error` |

> Korean docs: [components/README.ko.md](./src/react/components/README.ko.md),
> [hooks/README.ko.md](./src/react/hooks/README.ko.md).

## Migrating from `@withwiz/toolkit/react`

The React layer used to live at `@withwiz/toolkit/react/*`. It now lives at
`@withwiz/ui/react/*` — a pure path-prefix change; the rest of each import path and all
component behavior are identical.

1. Add `@withwiz/ui` and bump `@withwiz/toolkit` to `>=0.8.0`:
   ```bash
   pnpm add @withwiz/ui
   ```
2. Run the codemod from your repo root (rewrites only the `@withwiz/toolkit/react`
   prefix; `@withwiz/toolkit/core/*` and other non-react imports are left untouched):
   ```bash
   bash node_modules/@withwiz/ui/scripts/codemod-toolkit-react.sh src
   ```
3. Type-check and build.

Consumers pinned to an older `@withwiz/toolkit` (which still bundles `react/*`) are
unaffected until they choose to migrate.
