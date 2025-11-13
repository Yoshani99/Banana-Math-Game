import { useNavigate } from "react-router-dom";
import BackgroundImg from "../assets/welcomepage.jpg";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${BackgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "'Poppins', sans-serif",
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Overlay for a soft dark background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      ></div>

      <div style={{ zIndex: 2 }}>
        <h1
          style={{
            fontSize: "85px",
            fontWeight: 800,
            marginBottom: "50px",
            letterSpacing: "2px",
            color: "#bde655ff", // bright yellow for banana theme
            textShadow: "2px 2px 10px rgba(215, 40, 40, 0.6)",
          }}
        >
          Banana Math
        </h1>

        <h3
          style={{
            fontSize: "50px",
            fontWeight: 400,
            marginBottom: "40px",
            color: "#fff",
            textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
          }}
        >
          Ready to play !
        </h3>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "12px 30px",
              border: "none",
              borderRadius: "15px",
              backgroundColor: "#3d7f59",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#2e6546")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#3d7f59")
            }
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "12px 30px",
              border: "none",
              borderRadius: "15px",
              backgroundColor: "#3d7f59",
              color: "#f6f1f1ff",
              fontWeight: "bold",
              fontSize: "20px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#2e6546")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#3d7f59")
            }
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
