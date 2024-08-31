import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { MovieSearch } from "../components/MovieSearch";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex flex-col min-h-screen">
        <header className="mb-4">
          <MovieSearch />
        </header>
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
