import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsBg from "../assets/loginpage.png";

function SettingsPage() {
  const navigate = useNavigate();

  // 🎵 State for sound toggle and level selection
  const [soundOn, setSoundOn] = useState(true);
  const [level, setLevel] = useState("Easy");

  const handleSaveSettings = () => {
    localStorage.setItem("sound", soundOn ? "on" : "off");
    localStorage.setItem("level", level);

    alert(`Settings saved! 🔊 Sound: ${soundOn ? "On" : "Off"} | Level: ${level}`);
    navigate("/"); // Go back to home or game page
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${SettingsBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(174, 241, 195, 0.56)",
          borderRadius: "25px",
          padding: "50px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          textAlign: "center",
          width: "420px",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            color: "#2b6e46",
            marginBottom: "35px",
            textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          Settings
        </h1>

        {/* Sound Setting */}
        <div style={{ marginBottom: "35px", textAlign: "left" }}>
          <h3
            style={{
              color: "#3d7f59",
              fontSize: "24px",
              marginBottom: "10px",
              fontWeight: 600,
            }}
          >
            Sound
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <label style={{ fontSize: "20px", color: "#333" }}>
              <input
                type="checkbox"
                checked={soundOn}
                onChange={(e) => setSoundOn(e.target.checked)}
                style={{ marginRight: "10px", transform: "scale(1.3)" }}
              />
              {soundOn ? "Sound On 🔊" : "Sound Off 🔇"}
            </label>
          </div>
        </div>

        {/* Level Setting */}
        <div style={{ marginBottom: "45px", textAlign: "left" }}>
          <h3
            style={{
              color: "#3d7f59",
              fontSize: "24px",
              marginBottom: "10px",
              fontWeight: 600,
            }}
          >
            Levels
          </h3>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "20px",
              color: "#333",
              outline: "none",
              fontFamily: "'Poppins', sans-serif",
              backgroundColor: "white",
            }}
          >
            <option value="Easy">Easy Level</option>
            <option value="Medium">Medium Level</option>
            <option value="Hard">Hard Level</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          style={{
            backgroundColor: "#3d7f59",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "14px 45px",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
            transition: "transform 0.3s ease, background-color 0.3s ease",
            fontFamily: "'Poppins', sans-serif",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2e6546")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#3d7f59")
          }
          onMouseDown={(e) =>
            ((e.target as HTMLButtonElement).style.transform = "scale(0.97)")
          }
          onMouseUp={(e) =>
            ((e.target as HTMLButtonElement).style.transform = "scale(1)")
          }
        >
          Save 
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
