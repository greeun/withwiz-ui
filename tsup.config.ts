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
  ],
});
