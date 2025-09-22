import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import MovieCard from "./MovieCard";
const PostMovie = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to suggest a movie");
        return;
      }

      const response = await axios.post(
        "https://mboard-taupe.vercel.app/api/movies/suggestMovie",
        { title, desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Movie suggested successfully", response.data);
      setTitle("");
      setDesc("");
      getMovies();
    } catch (error) {
      console.error("Error suggesting movie", error);
      alert("Error suggesting movie");
    }
  };

  const getMovies = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://mboard-taupe.vercel.app/api/movies/getAllMovies"
      );
      console.log("response from get all movies", response.data);

      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error getting movies", error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <>
      <form
        onSubmit={handleSumbit}
        className="w-2xl mx-auto p-4 border-b flex flex-col bg-transparent  border-gray-600 rounded"
      >
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="title">
            Movie Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="desc">
            Brief Description
          </label>
          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-32 cursor-pointer bg-gradient-to-br mb-4 from-gray-600 to-gray-700 rounded-full text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Suggest
        </button>
      </form>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Latest Movie Suggestions
          </h2>
          <p className="text-gray-400">
            Discover what the community is watching
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className=" flex flex-col">
            {[...movies].reverse().map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No Movies Yet
            </h3>
            <p className="text-gray-500">Be the first to suggest a movie!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PostMovie;
