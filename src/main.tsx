/**
 * @file src/main.tsx
 */

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import AppRouter from "./routes/app-router";

import "./styles/variables.module.css";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
