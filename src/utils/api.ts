export const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjI4ZDRjNTg1ZTY2MDlkMjQxNDAzYWVjNmVkYzNmYSIsIm5iZiI6MTcyNTA5Mzc2Ny40NDE3OTIsInN1YiI6IjYxNzcxYTIxOTI0Y2U2MDA5MmM4NDcwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._v35Xy-Q8-p6moAw665X3zEKRs1lNn2eLoRbf2yeMqQ";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
}

export const fetchTrendingMovies = async (page: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<{
    results: Movie[];
    total_pages: number;
  }>;
};
