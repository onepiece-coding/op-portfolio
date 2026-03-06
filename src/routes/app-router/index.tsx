/**
 * @file src/routes/app-router/index.tsx
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WithSuspense } from "../with-suspense";
import { lazy } from "react";

import ErrorBoundary from "@/pages/error-boundary"; // ✅ eager — must always be available
import ErrorElement from "@/pages/error-element"; // ✅ eager — must always be available

const Testimonials = lazy(() => import("@/pages/testimonials"));
const MainLayout = lazy(() => import("@/layouts/main-layout"));
const Projects = lazy(() => import("@/pages/projects"));
const Services = lazy(() => import("@/pages/services"));
const Contact = lazy(() => import("@/pages/contact"));
const Hero = lazy(() => import("@/pages/hero"));
const Duo = lazy(() => import("@/pages/duo"));

const routes = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <ErrorBoundary>
          <WithSuspense>
            <MainLayout />
          </WithSuspense>
        </ErrorBoundary>
      ),
      errorElement: <ErrorElement />,
      children: [
        {
          index: true,
          element: (
            <WithSuspense>
              <Hero />
            </WithSuspense>
          ),
        },
        {
          path: "duo",
          element: (
            <WithSuspense>
              <Duo />
            </WithSuspense>
          ),
        },
        {
          path: "projects",
          element: (
            <WithSuspense>
              <Projects />
            </WithSuspense>
          ),
        },
        {
          path: "services",
          element: (
            <WithSuspense>
              <Services />
            </WithSuspense>
          ),
        },
        {
          path: `testimonials`,
          element: (
            <WithSuspense>
              <Testimonials />
            </WithSuspense>
          ),
        },
        {
          path: `contact`,
          element: (
            <WithSuspense>
              <Contact />
            </WithSuspense>
          ),
        },
      ],
    },
  ],
  { basename: "/op-portfolio/" },
);

const AppRouter = () => {
  return <RouterProvider router={routes} />;
};

export default AppRouter;
