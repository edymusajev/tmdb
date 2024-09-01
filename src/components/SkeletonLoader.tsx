import { MovieCardSkeleton } from "./MovieCard";

export function SkeletonLoader() {
  return (
    <div className="p-4">
      <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
