import { useQuery } from "@tanstack/react-query";
import { BackToHomeLink } from "./BackToHomeLink";
import { MovieContent } from "./MovieContent";
import { RelatedMovies } from "./RelatedMovies";
import { fetchMovieDetails, fetchRelatedMovies } from "../utils/api";

export function MovieDetails({ movieId }: { movieId: string }) {
  const {
    data: movie,
    isLoading: isMovieLoading,
    isError: isMovieError,
    error: movieError,
  } = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => fetchMovieDetails(movieId),
  });

  const {
    data: relatedMovies,
    isLoading: isRelatedLoading,
    isError: isRelatedError,
    error: relatedError,
  } = useQuery({
    queryKey: ["relatedMovies", movieId],
    queryFn: () => fetchRelatedMovies(movieId),
  });

  if (isMovieError || isRelatedError) {
    return <div>Error: {(movieError || relatedError)?.message}</div>;
  }

  return (
    <>
      <BackToHomeLink />
      <MovieContent movie={movie} isLoading={isMovieLoading} />
      <RelatedMovies
        movies={relatedMovies?.results}
        isLoading={isRelatedLoading}
      />
    </>
  );
}
