import { MovieDetails } from "../utils/api";

export function MovieMetadata({ movie }: { movie: MovieDetails }) {
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
