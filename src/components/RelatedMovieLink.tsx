import { Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { fetchMovieDetails, fetchRelatedMovies, Movie } from "../utils/api";

export function RelatedMovieLink({ movie }: { movie: Movie }) {
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
