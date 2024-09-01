import { Movie } from "../utils/api";
import { MovieImage } from "./MovieImage";

export function MovieItem({ movie }: { movie: Movie }) {
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
