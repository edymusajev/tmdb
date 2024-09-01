export function SkeletonMovieDetails() {
  return (
    <>
      <div className="w-full md:w-1/3 bg-gray-300 rounded-lg shadow-lg h-96 animate-pulse" />
      <div className="md:ml-8 mt-4 md:mt-0 w-full md:w-2/3">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4 animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4 animate-pulse" />
        <div className="h-20 bg-gray-300 rounded mb-4 animate-pulse" />
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-300 rounded w-full animate-pulse"
              />
            ))}
        </div>
      </div>
    </>
  );
}
