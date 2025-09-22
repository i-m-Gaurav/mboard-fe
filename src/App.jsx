import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import LeaderBoard from "./components/Leaderboard";


function App() {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element = { user?.role ==="admin"? <LeaderBoard/> : <Navigate to ="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
