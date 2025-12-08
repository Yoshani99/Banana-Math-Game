import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LevelPageBg from "../assets/LoginPage.png";

// type LevelType = "Easy" | "Medium" | "Hard";

function LevelPage() {
  const [selectedLevel, setSelectedLevel] = useState("Easy");
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/game", {
      
      state: { selectedLevel },
    });
    console.log("Navigating to GamePage with level:", selectedLevel);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${LevelPageBg})`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
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
          marginRight: "300px", 
        }}
      >
        <h1 style={{ fontSize: "50px", fontWeight: "800" }}>Select Level</h1>

        {["Easy", "Medium", "Hard"].map((level) => (
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
                selectedLevel === level ? "#92e887ff" : "rgba(255,255,255,0.8)",
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
