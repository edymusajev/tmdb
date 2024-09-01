import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { MovieSearch } from "../components/MovieSearch";
import { lazy, Suspense } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const Route = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />

      <div className="p-2 flex flex-col min-h-screen">
        <header className="mb-4">
          <MovieSearch />
        </header>
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});
