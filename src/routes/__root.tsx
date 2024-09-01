import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { MovieSearch } from "../components/MovieSearch";

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
    </>
  ),
});
