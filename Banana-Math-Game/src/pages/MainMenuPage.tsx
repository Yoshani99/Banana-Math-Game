import { useEffect, useState } from "react";
import InstructionPage from "./InstructionPage";
import LevelPage from "./LevelsPage";
import SettingPage from "./SettingPage";
import LeaderboardPage from "./LeaderBoardPage";
import ProfilePage from "./profilePage";
import GamePage from "./GamePage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";


type MenuPage =
  | "game"
  | "instructions"
  | "levels"
  | "settings"
  | "leaderboard"
  | "profile";

// STRONG LEVEL TYPE
type GameLevel = "Easy" | "Medium" | "Hard";

export default function MainMenu() {
  const [activePage, setActivePage] = useState<MenuPage>("profile");
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  //  FIXED: STRONG TYPE + NULL SAFE
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);

  //  LOAD USER DATA
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = localStorage.getItem("userUID");
        if (!uid) return;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "instructions":
        return <InstructionPage />;

      case "levels":
        return (
          <LevelPage
            // FIXED: STRONG LEVEL TYPE
            onSelectLevel={(level: GameLevel) => {
              setSelectedLevel(level);
              setActivePage("game"); // AUTO LOAD GAME
            }}
          />
        );

      case "settings":
        return <SettingPage />;

      case "leaderboard":
        return <LeaderboardPage />;

      case "profile":
        return <ProfilePage />;

      case "game":
        // FIXED: NEVER ALLOW NULL TO REACH GAMEPAGE
        return <GamePage selectedLevel={selectedLevel || "Easy"} />;

      default:
        return <ProfilePage />;
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userUID");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* LEFT MENU */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#2E7D32",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>BananaMath</h2>

        {/*  USER PROFILE BOX */}
        {userData && (
          <div
            style={{
              backgroundColor: "#1B5E20",
              padding: "15px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
      <button
              style={{
                position: "relative",
                top: "10px",
                left: "80px",
                padding: "5px 10px",
                borderRadius: "10px",
                border: "none",
                color: "white",
                fontSize: "10px",
                cursor: "pointer",
                backgroundColor:"#4CAF50",
                marginTop: "auto",
              //  position: "absolute", right: "20px",
                
              }}

              onClick={handleLogout}
            >
              Logout
            </button>


            <div


              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "35px",
                margin: "0 auto 8px",
              }}
            >
              👤
            </div>
      
            <p>
              <b>{userData.username}</b>
            </p>
          </div>
        )}


        <button style={menuButton} onClick={() => setActivePage("instructions")}>
          Instructions
        </button>
        <button style={menuButton} onClick={() => setActivePage("levels")}>
          Levels
        </button>
        <button style={menuButton} onClick={() => setActivePage("leaderboard")}>
          Leaderboard
        </button>
        <button style={menuButton} onClick={() => setActivePage("settings")}>
          Settings
        </button>
        <button style={menuButton} onClick={() => setActivePage("profile")}>
          Profile
        </button>
      </div>

      {/*  RIGHT CONTENT */}
      <div style={{ flex: 2, backgroundColor: "#E8F5E9" }}>{renderPage()}</div>
    </div>
  );
}

const menuButton: React.CSSProperties = {
  backgroundColor: "#4CAF50",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};
