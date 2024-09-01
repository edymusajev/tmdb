import { createFileRoute } from "@tanstack/react-router";
import { ScrollRestoration } from "@tanstack/react-router";
import { useEffect } from "react";
import { MovieDetails } from "../components/MovieDetails";
import { fetchMovieDetails, fetchRelatedMovies } from "../utils/api";

export const Route = createFileRoute("/title/$slug")({
  component: MovieDetailsPage,
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

function MovieDetailsPage() {
  const { slug } = Route.useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ScrollRestoration
        getKey={(location) =>
          location.pathname.startsWith("/title/") ? location.pathname : ""
        }
      />
      <MovieDetails movieId={slug} />
    </div>
  );
}
