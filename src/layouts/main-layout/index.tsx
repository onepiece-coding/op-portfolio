/**
 * @file src/layouts/main-layout/index.tsx
 */

import { Navbar } from "@/components/common";
import { Footer } from "@/components/common";
import { Outlet } from "react-router-dom";

import styles from "./main-layout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.layoutRoot}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
