import { useState } from "react";
import LevelPageBg from "../assets/LoginPage.png";


function LevelPage() {
  const [selectedLevel, setSelectedLevel] = useState("Easy");

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${LevelPageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        color: "#2b6e46",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(199, 233, 210, 0.9)",
          borderRadius: "25px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
          width: "400px",
          padding: "50px 35px",
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "800",
            color: "#3d7f59",
            marginBottom: "30px",
            textShadow: "2px 2px 6px rgba(0,0,0,0.25)",
            letterSpacing: "1px",
          }}
        >
          Select Level
        </h1>

        {/* Level Options */}
        {["Easy", "Medium", "Hard"].map((level) => (
          <div
            key={level}
            onClick={() => setSelectedLevel(level)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor:
                selectedLevel === level ? "#a9efa0ff" : "rgba(255,255,255,0.8)",
              border: "2px solid #20cc68ff",
              borderRadius: "15px",
              padding: "15px 25px",
              marginBottom: "18px",
              fontSize: "22px",
              fontWeight: "600",
              color: selectedLevel === level ? "#2b6e46" : "#444",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow:
                selectedLevel === level
                  ? "0 4px 10px rgba(101, 211, 50, 0.3)"
                  : "none",
            }}
          >
            <span>{level}</span>
            <span>{selectedLevel === level ? "✔️" : ""}</span>
          </div>
        ))}

        {/* Confirm Button */}
        <button
          style={{
            backgroundColor: "#3d7f59",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "14px 40px",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            marginTop: "25px",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2e6546")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#3d7f59")
          }
          onClick={() => alert(`Selected Level: ${selectedLevel}`)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default LevelPage;
