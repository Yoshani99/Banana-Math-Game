import { useState } from "react";
import LevelPageBg from "../assets/LoginPage.png";
import InstructionPageBg from "../assets/LoginPage.png";
// STRONG LEVEL TYPE
export type GameLevel = "Easy" | "Medium" | "Hard";

type Props = {
  onSelectLevel: (level: GameLevel) => void;
};

function LevelPage({ onSelectLevel }: Props) {
  // STRONG DEFAULT TYPE
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>("Easy");

  const handleConfirm = () => {
    onSelectLevel(selectedLevel); // always safe
    console.log("Selected Level:", selectedLevel);
  };

  const levels: GameLevel[] = ["Easy", "Medium", "Hard"];

  return (
    <div
       style={{
        height: "100vh",
        backgroundImage: `url(${LevelPageBg})`,
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        width: "100vw",
        position: "fixed",
      }}
    >
      <div
        style={{
          background: "rgba(174, 241, 195, 0.56)",
          borderRadius: "25px",
          padding: "50px 35px",
          width: "400px",
          textAlign: "center",
          backdropFilter: "blur(8px)",
          color: "#2e7d32",
           position: "relative",
          marginLeft: "20px",
          marginRight: "360px",
          marginBottom: "70px",
        }}
      >
        <h1 style={{ fontSize: "50px", fontWeight: "800" }}>
          Select Level
        </h1>

        {levels.map((level) => (
          <div
            key={level}
            onClick={() => setSelectedLevel(level)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 25px",
              marginBottom: "18px",
              cursor: "pointer",
              backgroundColor:
                selectedLevel === level
                  ? "#92e887ff"
                  : "rgba(255,255,255,0.8)",
              border: "2px solid #20cc68",
              borderRadius: "15px",
            }}
          >
            <span>{level}</span>
            {selectedLevel === level && <span>✔️</span>}
          </div>
        ))}

        <button
          onClick={handleConfirm}
          style={{
            backgroundColor: "#3d7f59",
            padding: "14px 40px",
            color: "white",
            borderRadius: "12px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default LevelPage;
