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
  external: [
    "react",
    "react-dom",
    "next",
    "clsx",
    "tailwind-merge",
    "lucide-react",
    "@radix-ui/react-select",
  ],
});
