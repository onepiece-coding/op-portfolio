import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "@components": path.resolve(__dirname, "./src/components"),
    },
  },

  base: "/op-portfolio/",

  server: {
    port: 3000,
  },

  // ✅ Vitest picks up resolve.alias from the same config automatically
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"], // ← matches your setupTests.ts in root
    globals: true,
  },
});
