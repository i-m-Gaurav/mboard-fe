import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))?.role === "admin"
    : false;
  //   console.log("token in navbar", token);
  const isLoggedIn = !!token;

  useEffect(() => {
    // Check if user is logged in

    if (token) {
      // Always fetch user profile since we only have token
      fetchUserProfile(token);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://mboard-taupe.vercel.app/api/user/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("response from profile fetch", response.data);

      if (response.data && response.data[0]) {
        const userData = response.data[0];
        setUser({ username: userData.name, email: userData.email });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // If profile fetch fails, token might be invalid
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowProfileDropdown(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    // Navigate to user profile page
    navigate("/profile");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const showLeaderBoard = () => {
    navigate("/leaderboard");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="text-2xl font-bold text-white">
            🎬 <span className="text-blue-400">MovieBoard</span>
          </div>
        </div>

        {/* Navigation Links - Middle */}
        {isAdmin && (
          <div className="hidden md:flex space-x-6">
            <button
              className="text-gray-300 hover:text-white transition-colors"
              onClick={showLeaderBoard}
            >
              LeaderBoard
            </button>
          </div>
        )}

        {/* Right side - Auth buttons or Profile */}
        <div className="flex items-center space-x-4">
          {isLoggedIn && user ? (
            /* Profile dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden md:block">
                  {user?.username || "User"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={handleProfileClick}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Profile</span>
                      </div>
                    </button>

                    <hr className="border-gray-700 my-1" />
                    <button
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : isLoggedIn && loading ? (
            /* Loading state when user is logged in but data is being fetched */
            <div className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              </div>
              <span className="hidden md:block text-gray-300">Loading...</span>
            </div>
          ) : (
            /* Sign in and Sign up buttons */
            <div className="flex items-center space-x-3">
              <button
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button - Optional for future mobile responsive design */}
      <div className="md:hidden mt-3">
        <div className="flex items-center justify-center space-x-6">
          <button
            className="text-gray-300 hover:text-white transition-colors"
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            className="text-gray-300 hover:text-white transition-colors"
            onClick={() => navigate("/movies")}
          >
            Movies
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
