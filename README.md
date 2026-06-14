# @withwiz/ui

withwiz React UI components. Extracted from @withwiz/toolkit src/react.

Import paths use a platform namespace, e.g. `@withwiz/ui/react/components/ui/data-table`.
Future platforms (e.g. `@withwiz/ui/react-native`) can be added under the same scheme.

## Dependencies

`@withwiz/ui` depends on `@withwiz/toolkit` (peer, `>=0.8.0`) — three React modules
(`react/utils/qr-code`, `react/hooks/useTimezone`, `react/error/error-display`) import
from `@withwiz/toolkit/core/*`. This is the allowed direction (toolkit is the base layer).

Styling is unchanged from the toolkit version: components render Tailwind utility classes
with shadcn design tokens. Consumers must provide a Tailwind + shadcn theme, exactly as
before. No CSS is shipped.

## Migrating from `@withwiz/toolkit/react`

The React layer used to live at `@withwiz/toolkit/react/*`. It now lives at
`@withwiz/ui/react/*` — a pure path-prefix change; the rest of each import path and all
component behavior are identical.

1. Add `@withwiz/ui` and bump `@withwiz/toolkit` to `>=0.9.0`:
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
