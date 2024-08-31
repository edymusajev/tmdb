import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Movie, TOKEN } from "./index";

interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
}

const fetchMovieDetails = async (id: string) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<MovieDetails>;
};

export const Route = createFileRoute("/title/$slug")({
  component: MovieDetails,
  loader: ({ params, context: { queryClient } }) => {
    // Ensure the query is prefetched before the route is rendered
    return queryClient.ensureQueryData({
      queryKey: ["movieDetails", params.slug],
      queryFn: () => fetchMovieDetails(params.slug),
    });
  },
});

function MovieDetails() {
  const { slug } = Route.useParams();
  const {
    data: movie,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["movieDetails", slug],
    queryFn: () => fetchMovieDetails(slug),
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <div className="flex flex-col md:flex-row">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />
        <div className="md:ml-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-500 italic">{movie.tagline}</p>
          <p className="mt-2">{movie.overview}</p>
          <div className="mt-4">
            <p>
              <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p>
              <strong>Runtime:</strong> {movie.runtime} minutes
            </p>
            <p>
              <strong>Status:</strong> {movie.status}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((g) => g.name).join(", ")}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average.toFixed(1)} (
              {movie.vote_count} votes)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
