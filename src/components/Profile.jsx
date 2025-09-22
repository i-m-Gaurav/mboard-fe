import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const getUserMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://mboard-taupe.vercel.app//api/movies/getUserMovies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error getting movies", error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(
        `https://mboard-taupe.vercel.app//api/movies/suggestedMovie/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Error deleting movie", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://mboard-taupe.vercel.app//api/user/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data[0]) {
          setUser(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getUserMovies();
    fetchUserProfile();
  }, [navigate, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-white text-center">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Left side - Profile */}
          <div className="w-1/3">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-xl font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {user.name}
                  </h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-white">
                    {user.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-white">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Member Since
                  </label>
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-white">
                    {new Date(
                      user.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Account Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Edit Profile
                  </button>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Change Password
                  </button>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete your account?")
                      ) {
                        // TODO: Implement delete account
                      }
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Movies */}
          <div className="w-2/3">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-[70vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Your Movies
              </h3>
              {movies.length === 0 ? (
                <p className="text-gray-400">No movies added yet.</p>
              ) : (
                <div className="space-y-4">
                  {movies.map((movie) => (
                    <div
                      key={movie._id}
                      className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {movie.title}
                        </h4>
                        <p className="text-gray-400">{movie.desc}</p>
                      </div>
                      <button
                        onClick={() => deleteMovie(movie._id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
