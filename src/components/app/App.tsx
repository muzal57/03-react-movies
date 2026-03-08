import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../searchbar/SearchBar";
import MovieGrid from "../moviegrid/MovieGrid";
import Loader from "../loader/Loader";
import ErrorMessage from "../errormessage/ErrorMessage";
import MovieModal from "../moviemodal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsError(false);
      setIsLoading(true);

      const data = await fetchMovies(query);

      if (data.results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(data.results);
    } catch (error) {
      setIsError(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}

      {movies.length > 0 && !isLoading && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {isLoading && <Loader />}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
