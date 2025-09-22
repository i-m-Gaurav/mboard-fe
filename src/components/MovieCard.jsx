import {
  ArrowBigUp,
  MessageSquareIcon,
  ArrowBigDown,
  User,
  Calendar,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";

const MovieCard = ({ movie }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [commentsInput, setCommentsInput] = useState("");
  const [comments, setComments] = useState(movie?.comments || []);
  const [likes, setLikes] = useState(Number(movie.likes) || 0);
  const [dislikes, setDislikes] = useState(Number(movie.dislikes) || 0);
  const [userVote, setUserVote] = useState(
    Number.isFinite(movie.userVote)
      ? movie.userVote
      : Number(movie.userVote) || 0
  );

  const movieId = movie?._id || "defaultId";

  const toggleVisibility = () => setIsVisible(!isVisible);

  const token = localStorage.getItem("token");
  const isAdmin =
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user")).role === "admin";

  const handleChange = (e) => setCommentsInput(e.target.value);

  const handleDelete = async () => {
    if (!isAdmin) {
      alert("You do not have permission to delete this movie.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://mboard-taupe.vercel.app/api/movies/suggestedMovie/${movieId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Movie deleted successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting movie", error);
      alert("Failed to delete the movie. Please try again.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentsInput.trim()) return;

    try {
      if (!token) {
        alert("You must be logged in to comment");
        return;
      }

      const response = await axios.post(
        `https://mboard-taupe.vercel.app/api/movies/suggestedMovie/${movieId}/comments`,
        { comment: commentsInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new comment to the list
      const newComment = {
        _id: Date.now(),
        comment: commentsInput,
        userId: response.data.userId || "You",
      };

      setComments([...comments, newComment]);
      setCommentsInput("");
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  const sendVote = async (voteType) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to vote");
      return;
    }

    const currentVote = Number(userVote) || 0;
    let newVote = voteType;

    if (currentVote === voteType) newVote = 0;

    try {
      const res = await axios.post(
        `https://mboard-taupe.vercel.app/api/movies/suggestedMovie/${movieId}/vote`,
        { vote: newVote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikes(Number(res.data?.likes) || 0);
      setDislikes(Number(res.data?.dislikes) || 0);
      setUserVote(Number(res.data?.userVote) || 0);
    } catch (error) {
      console.error("Error sending vote", error);
    }
  };

  return (
    <div className="bg-gradient-to-br mb-4 from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-700">
      {/* Movie Header */}
      <div className="p-6 border-b w-2xl  border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl font-bold text-white leading-tight flex-1 mr-4">
            {movie.title}
          </h2>
          {isAdmin && (
            <div
              onClick={handleDelete}
              className="flex cursor-pointer items-center text-gray-400 text-sm"
            >
              <Trash2Icon className="w-4 h-4 mr-1 " />
              <span>Trash</span>
            </div>
          )}
        </div>

        <p className="text-gray-300 leading-relaxed text-sm">{movie.desc}</p>

        {/* Suggested by */}
        <div className="flex items-center mt-4 text-gray-400 text-xs">
          <User className="w-3 h-3 mr-1" />
          <span>Suggested by {movie.userId?.username || "Anonymous"}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Upvote Button */}
            <button
              onClick={() => sendVote(1)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
                userVote === 1
                  ? "bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20"
                  : "text-gray-400 hover:text-green-400 hover:bg-green-500/10"
              }`}
            >
              <ArrowBigUp className="w-5 h-5" />
              <span className="font-semibold">{likes}</span>
            </button>

            {/* Downvote Button */}
            <button
              onClick={() => sendVote(-1)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
                userVote === -1
                  ? "bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20"
                  : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              }`}
            >
              <ArrowBigDown className="w-5 h-5" />
              <span className="font-semibold">{dislikes}</span>
            </button>
          </div>

          {/* Comments Button */}
          <button
            onClick={toggleVisibility}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isVisible
                ? "bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
            }`}
          >
            <MessageSquareIcon className="w-5 h-5" />
            <span className="font-semibold">{comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {isVisible && (
        <div className="border-t border-gray-700 bg-gray-900/50">
          {/* Add Comment Form */}
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <MessageSquareIcon className="w-4 h-4 mr-2" />
              Comments ({comments.length})
            </h3>

            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <textarea
                placeholder="Share your thoughts about this movie..."
                value={commentsInput}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commentsInput.trim()}
                  className="px-6 py-2 bg-gradient-to-br mb-4 from-gray-600 to-gray-700 hover:cursor-pointer  text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="p-6">
            {comments.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {comments.map((cmt, index) => (
                  <div
                    key={cmt._id || index}
                    className="bg-gray-800/70 rounded-lg p-4 border border-gray-700/50"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {cmt.userId?.username?.[0]?.toUpperCase() || "A"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium text-sm">
                            {cmt.userId?.username || "Anonymous"}
                          </span>
                          <span className="text-gray-500 text-xs">•</span>
                          <span className="text-gray-500 text-xs">
                            Just now
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {cmt.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquareIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No comments yet</p>
                <p className="text-gray-500 text-sm">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
