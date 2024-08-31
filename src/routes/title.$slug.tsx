import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScrollRestoration } from "@tanstack/react-router";
import { useEffect } from "react";
import { Movie, TOKEN } from "./index";

// Types
interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
}

// API functions
const fetchMovieDetails = async (id: string): Promise<MovieDetails> => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return response.json();
};

const fetchRelatedMovies = async (
  id: string
): Promise<{ results: Movie[] }> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch related movies");
  return response.json();
};

// Route definition
export const Route = createFileRoute("/title/$slug")({
  component: MovieDetails,
  loader: ({ params, context: { queryClient } }) => {
    const movieId = params.slug;
    return Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["movieDetails", movieId],
        queryFn: () => fetchMovieDetails(movieId),
      }),
      queryClient.ensureQueryData({
        queryKey: ["relatedMovies", movieId],
        queryFn: () => fetchRelatedMovies(movieId),
      }),
    ]);
  },
});

// Component
function MovieDetails() {
  const { slug } = Route.useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const {
    data: movie,
    isLoading: isMovieLoading,
    isError: isMovieError,
    error: movieError,
  } = useQuery({
    queryKey: ["movieDetails", slug],
    queryFn: () => fetchMovieDetails(slug),
  });

  const {
    data: relatedMovies,
    isLoading: isRelatedLoading,
    isError: isRelatedError,
    error: relatedError,
  } = useQuery({
    queryKey: ["relatedMovies", slug],
    queryFn: () => fetchRelatedMovies(slug),
  });

  if (isMovieError || isRelatedError) {
    return <div>Error: {(movieError || relatedError)?.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ScrollRestoration
        getKey={(location) =>
          location.pathname.startsWith("/title/") ? location.pathname : ""
        }
      />
      <BackToHomeLink />
      <MovieContent movie={movie} isLoading={isMovieLoading} />
      <RelatedMovies
        movies={relatedMovies?.results}
        isLoading={isRelatedLoading}
      />
    </div>
  );
}

// Sub-components
function BackToHomeLink() {
  return (
    <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
      &larr; Back to Home
    </Link>
  );
}

function MovieContent({
  movie,
  isLoading,
}: {
  movie?: MovieDetails;
  isLoading: boolean;
}) {
  if (isLoading) return <SkeletonMovieDetails />;
  if (!movie) return null;

  return (
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
        <MovieMetadata movie={movie} />
      </div>
    </div>
  );
}

function MovieMetadata({ movie }: { movie: MovieDetails }) {
  return (
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
        <strong>Genres:</strong> {movie.genres.map((g) => g.name).join(", ")}
      </p>
      <p>
        <strong>Rating:</strong> {movie.vote_average.toFixed(1)} (
        {movie.vote_count} votes)
      </p>
    </div>
  );
}

function RelatedMovies({
  movies,
  isLoading,
}: {
  movies?: Movie[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <SkeletonRelatedMovie key={index} />
          ))}
      </div>
    );
  }

  if (!movies) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.slice(0, 6).map((relatedMovie) => (
          <RelatedMovieLink key={relatedMovie.id} movie={relatedMovie} />
        ))}
      </div>
    </div>
  );
}

function RelatedMovieLink({ movie }: { movie: Movie }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleClick = (event: React.MouseEvent<"a">) => {
    event.preventDefault();
    Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["movieDetails", movie.id.toString()],
        queryFn: () => fetchMovieDetails(movie.id.toString()),
      }),
      queryClient.prefetchQuery({
        queryKey: ["relatedMovies", movie.id.toString()],
        queryFn: () => fetchRelatedMovies(movie.id.toString()),
      }),
    ]).then(() => {
      router.navigate({
        to: "/title/$slug",
        params: { slug: movie.id.toString() },
      });
    });
  };

  return (
    <Link
      to="/title/$slug"
      params={{ slug: movie.id.toString() }}
      className="block"
      onClick={handleClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="w-full rounded-lg shadow-md"
      />
      <p className="mt-2 text-sm font-semibold">{movie.title}</p>
    </Link>
  );
}

function SkeletonMovieDetails() {
  return (
    <>
      <div className="w-full md:w-1/3 bg-gray-300 rounded-lg shadow-lg h-96 animate-pulse" />
      <div className="md:ml-8 mt-4 md:mt-0 w-full md:w-2/3">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4 animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4 animate-pulse" />
        <div className="h-20 bg-gray-300 rounded mb-4 animate-pulse" />
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-300 rounded w-full animate-pulse"
              />
            ))}
        </div>
      </div>
    </>
  );
}

function SkeletonRelatedMovie() {
  return (
    <div className="block">
      <div className="w-full h-48 bg-gray-300 rounded-lg shadow-md animate-pulse" />
      <div className="mt-2 h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
    </div>
  );
}
