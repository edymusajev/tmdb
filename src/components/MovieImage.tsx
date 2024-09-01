import { useState } from "react";
import { Image } from "lucide-react";
import { Movie } from "../utils/api";

function MovieCardSkeleton() {
  return (
    <div className="flex items-center justify-center bg-gray-200 w-16 h-24 rounded">
      <Image className="text-gray-400" size={24} />
    </div>
  );
}

export function MovieImage({ movie }: { movie: Movie }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-16 h-24 flex-shrink-0">
      {(!movie.poster_path || !imageLoaded) && <MovieCardSkeleton />}
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover rounded"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          style={{ display: imageLoaded ? "block" : "none" }}
        />
      )}
    </div>
  );
}
