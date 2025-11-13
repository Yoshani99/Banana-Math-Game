import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Leaderboard from "./pages/LeaderBoardPage";
import Profile from "./pages/profilePage";


// Import your pages



function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />


      </Routes>

    
    </Router>
  );
}

export default App;
