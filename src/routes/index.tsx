import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { MovieCard } from "../components/MovieCard";
import { Pagination } from "../components/Pagination";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { fetchTrendingMovies } from "../utils/api";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => {
    const { queryClient } = context as { queryClient: QueryClient };
    if (!queryClient) {
      throw new Error("QueryClient not found in context");
    }
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
