import axios from "axios";
import { useEffect, useState } from "react";

import PostMovie from "./PostMovie";
import Navbar from "./Navbar";
const Home = () => {
  const [movies, setMovies] = useState([]);

  const getAllMovies = async () => {
    const response = await axios.get(
      "https://mboard-taupe.vercel.app/api/movies/getAllMovies"
    );
    setMovies(response.data);
  };

  useEffect(() => {
    getAllMovies();
  }, []);


  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="text-white flex  flex-col justify-center items-center  w-3xl mx-auto my-4 p-4 rounded">
        <PostMovie />
      </div>
    </div>
  );
};

export default Home;
