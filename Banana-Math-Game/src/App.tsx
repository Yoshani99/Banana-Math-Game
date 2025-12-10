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
import MainMenuPage from "./pages/MainMenuPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const handleSelectLevel = (level: string) => {
    // Handle level selection logic here
    console.log("Selected level:", level);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/instructions" element={<InstructionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/level" element={<LevelPage onSelectLevel={handleSelectLevel} />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/mainmenu" element={<MainMenuPage />} />
      </Routes>

      {/* ✅ TOAST WORKS CORRECTLY FROM HERE */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </Router>
  );
}

export default App;
