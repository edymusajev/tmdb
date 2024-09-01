import { useState, useRef, useEffect } from "react";
import { Command } from "cmdk";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Search, X } from "lucide-react";
import { searchMovies } from "../utils/movieApi";
import { SearchResults } from "./SearchResults";

export function MovieSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: movies, isLoading } = useQuery({
    queryKey: ["searchMovies", debouncedSearch],
    queryFn: () => searchMovies(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".movie-item")
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Command className="relative w-full max-w-2xl mx-auto my-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10"
          size={18}
        />
        <Command.Input
          ref={inputRef}
          value={search}
          onValueChange={setSearch}
          onFocus={() => setOpen(true)}
          placeholder="Search movies..."
          className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none"
        />
        {search && (
          <button
            onClick={() => {
              setSearch("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <SearchResults
            movies={movies ?? []}
            isLoading={isLoading}
            setOpen={setOpen}
          />
        </div>
      )}
    </Command>
  );
}
