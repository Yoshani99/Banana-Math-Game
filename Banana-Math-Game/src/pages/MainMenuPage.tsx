import { useState } from "react";
import GamePage from "./GamePage";
import InstructionPage from "./InstructionPage";
import LevelPage from "./LevelsPage";
import SettingPage from "./SettingPage";
import LeaderboardPage from "./LeaderBoardPage";
import ProfilePage from "./profilePage";

type MenuPage =
  | "game"
  | "instructions"
  | "levels"
  | "settings"
  | "leaderboard"
  | "profile";

export default function MainMenu() {
  const [activePage, setActivePage] = useState<MenuPage>("profile");

  const renderPage = () => {
    switch (activePage) {
     
      case "instructions":
        return <InstructionPage />;
      case "levels":
        return <LevelPage />;
      case "settings":
        return <SettingPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "profile":
         return <ProfilePage />;
        //   case "game":
        //  return <GamePage selectedLevel="Easy" />;

      default:
            return <ProfilePage />;

    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* LEFT MENU BAR */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#2E7D32",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          🍌 BananaMath
        </h2>

      

        <button
          style={menuButton}
          onClick={() => setActivePage("instructions")}
        >
          Instructions
        </button>

        <button
          style={menuButton}
          onClick={() => setActivePage("levels")}
        >
          Levels
        </button>

        <button
          style={menuButton}
          onClick={() => setActivePage("leaderboard")}
        >
          Leaderboard
        </button>

        <button
          style={menuButton}
          onClick={() => setActivePage("settings")}
        >
          Settings
        </button>

        <button
          style={menuButton}
          onClick={() => setActivePage("profile")}
        >
          Profile
        </button>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#E8F5E9",
          padding: "0px",
        }}
      >
        {renderPage()}
      </div>
    </div>
  );
}

const menuButton: React.CSSProperties = {
  backgroundColor: "#4CAF50",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  fontSize: "16px",
  color: "white",
  cursor: "pointer",
  textAlign: "left",
};

// import { useNavigate } from "react-router-dom";

// export default function MainMenu() {
//   const navigate = useNavigate();

//   return (
//     <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
//       {/* LEFT MENU BAR */}
//       <div
//         style={{
//           width: "250px",
//           backgroundColor: "#2E7D32",
//           color: "white",
//           padding: "20px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "20px",
//         }}
//       >
//         <h2 style={{ textAlign: "center" }}>🍌 BananaMath</h2>

        

//         {/* <button onClick={() => navigate("/game")} style={menuButton}>
//           🕹 Play Game (Easy Default)
//         </button> */}
//          <button onClick={() => navigate("/Leaderboard")} style={menuButton}>
//           🕹 Leader Bord
//         </button>
//          <button onClick={() => navigate("/instructions")} style={menuButton}>
//           🕹 Instructions
//         </button>
//          <button onClick={() => navigate("/game")} style={menuButton}>
//           🕹 Play Game (Easy Default)
//         </button>
//         <button onClick={() => navigate("/level")} style={menuButton}>
//           ⭐ Play Game
//         </button>
//       </div>

//       <div style={{ flex: 1, backgroundColor: "#E8F5E9" }}>
        
//         <h1 style={{ padding: "20px" ,color: "black" }}>Welcome to BananaMath!</h1>
//       </div>
//     </div>
//   );
// }

// const menuButton: React.CSSProperties = {
//   backgroundColor: "#4CAF50",
//   padding: "12px",
//   borderRadius: "10px",
//   border: "none",
//   fontSize: "16px",
//   color: "white",
//   cursor: "pointer",
//   textAlign: "left",
// };
// import { useNavigate, Outlet } from "react-router-dom";

// export default function MainMenu() {
//   const navigate = useNavigate();

//   return (
//     <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
//       {/* LEFT MENU BAR */}
//       <div
//         style={{
//           width: "250px",
//           backgroundColor: "#2E7D32",
//           color: "white",
//           padding: "20px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "20px",
//         }}
//       >
//         <h2 style={{ textAlign: "center" }}>🍌 BananaMath</h2>

//         <button onClick={() => navigate("/leaderboard")} style={menuButton}>
//           🏆 Leaderboard
//         </button>

//         <button onClick={() => navigate("/instructions")} style={menuButton}>
//           📘 Instructions
//         </button>

//         <button onClick={() => navigate("/game")} style={menuButton}>
//           🕹 Play Game (Easy Default)
//         </button>

//         <button onClick={() => navigate("/level")} style={menuButton}>
//           ⭐ Play Game (Levels)
//         </button>
//       </div>

//       {/* RIGHT CONTENT AREA */}
//       <div style={{ flex: 1, backgroundColor: "#E8F5E9" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// const menuButton = {
//   backgroundColor: "#4CAF50",
//   padding: "12px",
//   borderRadius: "10px",
//   border: "none",
//   fontSize: "16px",
//   color: "white",
//   cursor: "pointer",
//   textAlign: "left",
// };
