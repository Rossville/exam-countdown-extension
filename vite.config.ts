import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

const target = process.env.TARGET || "chrome";

function generateManifest() {
  const manifest = readJsonFile("manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

export default defineConfig({
  root: 'src', 
  define: {
    __BROWSER__: JSON.stringify(target),
  },
  build:{
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [
    tailwindcss(),
    webExtension({
      browser: process.env.TARGET_BROWSER,
      manifest: generateManifest,
      watchFilePaths: ["package.json", "manifest.json"],
    }),
  ],
});
