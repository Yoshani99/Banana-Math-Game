//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Leaderboard from "./pages/LeaderBoardPage";
import Profile from "./pages/profilePage";
import Welcome from "./pages/welcomePage";
import InstructionPage from "./pages/InstructionPage";
import SettingsPage from "./pages/SettingPage"; 
import LevelPage from "./pages/LevelsPage";
import GamePage from "./pages/GamePage";


// Import your pages



function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/instructions" element={<InstructionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/level" element={<LevelPage />} />
        <Route path="/game" element={<GamePage selectedLevel="easy" />} />


      </Routes>

    
    </Router>
  );
}

export default App;
