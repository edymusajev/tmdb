import { Command } from "cmdk";
import { Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Movie } from "../utils/api";
import { MovieItem } from "./MovieItem";

interface SearchResultsProps {
  movies: Movie[];
  isLoading: boolean;
  setOpen: (open: boolean) => void;
}

export function SearchResults({
  movies,
  isLoading,
  setOpen,
}: SearchResultsProps) {
  const navigate = useNavigate();

  const handleSelect = (movieId: number) => {
    navigate({ to: "/title/$slug", params: { slug: movieId.toString() } });
    setOpen(false);
  };

  return (
    <Command.List className="max-h-[70vh] overflow-y-auto p-2">
      {isLoading && (
        <Command.Loading>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin mr-2" size={18} />
            <span>Searching movies...</span>
          </div>
        </Command.Loading>
      )}

      {!isLoading && movies.length === 0 && (
        <Command.Empty className="text-center py-4 text-gray-500">
          No results found.
        </Command.Empty>
      )}

      {movies.map((movie) => (
        <div
          key={movie.id}
          onClick={() => handleSelect(movie.id)}
          className="movie-item"
        >
          <MovieItem movie={movie} />
        </div>
      ))}
    </Command.List>
  );
}
