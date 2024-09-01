import { useState, useRef, useEffect } from "react";
import { Command } from "cmdk";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Search, X, Loader2, Image } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Movie, TOKEN } from "../utils/api";

const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.results;
};

function MovieCardSkeleton() {
  return (
    <div className="flex items-center justify-center bg-gray-200 w-16 h-24 rounded">
      <Image className="text-gray-400" size={24} />
    </div>
  );
}

function MovieImage({ movie }: { movie: Movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-16 h-24 flex-shrink-0">
      {(!movie.poster_path || !imageLoaded) && <MovieCardSkeleton />}
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover rounded"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          style={{ display: imageLoaded ? "block" : "none" }}
        />
      )}
    </div>
  );
}

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

function SearchResults({
  movies,
  isLoading,
  setOpen,
}: {
  movies: Movie[];
  isLoading: boolean;
  setOpen: (open: boolean) => void;
}) {
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

function MovieItem({ movie }: { movie: Movie }) {
  return (
    <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer flex items-start transition-colors duration-200">
      <MovieImage movie={movie} />
      <div className="flex flex-col ml-3 flex-grow">
        <span className="font-semibold text-gray-800">{movie.title}</span>
        <span className="text-sm text-gray-600">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}{" "}
          |{" "}
          {movie.vote_count > 1
            ? `⭐ ${movie.vote_average.toFixed(1)}`
            : "No ratings"}
        </span>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
