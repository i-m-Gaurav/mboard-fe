import React from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useEffect, useState } from "react";

const LeaderBoard = () => {
  const [movies, setMovies] = useState([]);

  const getAllMovies = async () => {
    try {
      const response = await axios.get(
        "https://mboard-taupe.vercel.app//api/movies/getAllMovies"
      );
      console.log("response from get all movies", response.data);

      setMovies(response.data);
    } catch (error) {
      console.error("Error getting movies", error);
    }
  };

  useEffect(() => {
    getAllMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-white mb-6">Leaderboard</h1>
        {movies.length === 0 ? (
          <p className="text-gray-400">No movies found.</p>
        ) : (
          <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-700 text-left">Rank</th>
                <th className="py-3 px-6 bg-gray-700 text-left">Title</th>
                <th className="py-3 px-6 bg-gray-700 text-left">Description</th>
                <th className="py-3 px-6 bg-gray-700 text-left">Likes</th>
                <th className="py-3 px-6 bg-gray-700 text-left">Dislikes</th>
              </tr>
            </thead>
            <tbody>
              {movies
                .sort((a, b) => b.likes - a.likes)
                .map((movie, index) => (
                  <tr
                    key={movie._id}
                    className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
                  >
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{movie.title}</td>
                    <td className="py-3 px-6">{movie.desc}</td>
                    <td className="py-3 px-6">{movie.likes}</td>
                    <td className="py-3 px-6">{movie.dislikes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;
