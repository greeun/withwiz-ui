import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/react/**/*.ts", "src/react/**/*.tsx"],
  format: ["esm"],
  outExtension: () => ({ js: ".js" }),
  platform: "neutral",
  dts: false,
  splitting: true,
  clean: true,
  outDir: "dist",
  esbuildOptions(options) {
    // Preserve the `react/` path segment in the output (dist/react/...),
    // matching the package.json `exports` targets. Without an explicit
    // outbase, tsup collapses the common entry dir (src/react) and emits
    // dist/components/... instead of dist/react/components/...
    options.outbase = "src";
  },
  external: [
    "react",
    "react-dom",
    "next",
    "clsx",
    "tailwind-merge",
    "lucide-react",
    "@radix-ui/react-select",
    "@withwiz/toolkit",
    "sonner",
    // react/primitives (shadcn/ui 기반)
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-label",
    "@radix-ui/react-progress",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-tooltip",
    "@radix-ui/react-visually-hidden",
    "class-variance-authority",
    "next-themes",
    "radix-ui",
    "react-hook-form",
  ],
});
