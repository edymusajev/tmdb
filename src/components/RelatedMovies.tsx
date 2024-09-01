import { Movie } from "../utils/api";
import { RelatedMovieLink } from "./RelatedMovieLink";
import { SkeletonRelatedMovie } from "./SkeletonRelatedMovie";

export function RelatedMovies({
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
