import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// without our own backend to route these requests through
// the client will see this JWT regardless so there's no point in hiding it
// i'm just hardcoding it here for ease of use during the demo
export const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjI4ZDRjNTg1ZTY2MDlkMjQxNDAzYWVjNmVkYzNmYSIsIm5iZiI6MTcyNTA5Mzc2Ny40NDE3OTIsInN1YiI6IjYxNzcxYTIxOTI0Y2U2MDA5MmM4NDcwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._v35Xy-Q8-p6moAw665X3zEKRs1lNn2eLoRbf2yeMqQ";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
}
// API function to fetch trending movies
const fetchTrendingMovies = async (page: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<{
    results: Movie[];
    total_pages: number;
  }>;
};

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context: { queryClient } }) => {
    return queryClient.prefetchQuery({
      queryKey: ["trendingMovies", 1],
      queryFn: () => fetchTrendingMovies(1),
    });
  },
  validateSearch: (search) => {
    return {
      page: Number(search.page) || 1,
    };
  },
});

function Index() {
  const { page } = useSearch({ from: "/" });
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["trendingMovies", page],
    queryFn: () => fetchTrendingMovies(page),
  });

  const handlePageChange = (newPage: number) => {
    navigate({ search: { page: newPage } });
  };

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-4">Trending Movies</h1>
      {isPending ? (
        <SkeletonLoader />
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {data.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={500}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to="/title/$slug"
      params={{ slug: movie.id.toString() }}
      className="relative block"
    >
      {!imageLoaded && <MovieCardSkeleton />}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className={`w-full h-auto rounded-lg ${imageLoaded ? "block" : "hidden"}`}
        onLoad={() => setImageLoaded(true)}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
        <p className="text-sm truncate">{movie.title}</p>
      </div>
    </Link>
  );
}

function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 w-full h-[337.50px] rounded-lg"></div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pageNumbers = [];
  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages, currentPage + 1);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300"
        aria-label="First page"
      >
        <ChevronsLeft size={20} />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            number === currentPage
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300"
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300"
        aria-label="Last page"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="p-4">
      <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
