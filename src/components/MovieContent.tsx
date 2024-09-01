import { MovieDetails } from "../utils/api";
import { MovieMetadata } from "./MovieMetadata";
import { SkeletonMovieDetails } from "./SkeletonMovieDetails";

export function MovieContent({
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
