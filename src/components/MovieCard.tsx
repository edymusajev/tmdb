import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Movie } from "../utils/api";

export function MovieCardSkeleton() {
  return (
    <div className="animate-pulse w-full h-0 pb-[150%] bg-gray-300 rounded-lg"></div>
  );
}

export function MovieCard({ movie }: { movie: Movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to="/title/$slug"
      params={{ slug: movie.id.toString() }}
      className="relative block"
    >
      {!imageLoaded && <MovieCardSkeleton />}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className={`w-full h-auto rounded-lg ${imageLoaded ? "block" : "hidden"}`}
        onLoad={() => setImageLoaded(true)}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
        <p className="text-sm truncate">{movie.title}</p>
      </div>
    </Link>
  );
}
