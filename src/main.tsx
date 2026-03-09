/**
 * @file src/main.tsx
 */

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import "@/i18n";
import i18n from "@/i18n";
import AppRouter from "./routes/app-router";

import "./styles/variables.css";
import "./styles/globals.css";

const mount = () => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppRouter />
    </StrictMode>,
  );
};

// Wait for i18next to finish loading the active language
// before mounting — prevents a flash of untranslated content
// If i18next already finished initialising before this listener
// was registered (common in dev with a warm cache), render immediately.
// Otherwise wait for the "initialized" event.
if (i18n.isInitialized) {
  mount();
} else {
  i18n.on("initialized", mount);
}
