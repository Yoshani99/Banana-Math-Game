import { useEffect, useState } from "react";
// @ts-ignore: Module '../firebase/config' has no type declarations
import { db } from "../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

// Import your background image (place it in src/assets)
import BackgroundImg from "../assets/LoginPage.png";


interface Score {
  username: string;
  score: number;
  level?: string;
}

function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const q = query(collection(db, "leaderboard"), orderBy("score", "desc"));
        const snapshot = await getDocs(q);
        const list: Score[] = snapshot.docs.map((doc) => doc.data() as Score);
        setScores(list);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchScores();
  }, []);

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
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(208, 194, 194, 0.8)",
          padding: "50px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          width: "400px",
          backdropFilter: "blur(8px)",
        }}
      >
        <h2
          style={{
            color: "#2b6e46",
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "25px",
            letterSpacing: "1px",
          }}
        >
          Leaderboard 🏆
        </h2>

        {scores.length === 0 ? (
          <p style={{ color: "#333", fontSize: "18px" }}>No scores yet</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "18px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#3d7f59", color: "white" }}>
                <th style={{ padding: "12px", borderRadius: "8px 0 0 0" }}>Rank</th>
                <th style={{ padding: "12px" }}>Username</th>
                <th style={{ padding: "12px", borderRadius: "0 8px 0 0" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((item, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#f7f7f7" : "#ffffff",
                    textAlign: "center",
                    fontWeight: i === 0 ? "bold" : "normal",
                    color:
                      i === 0
                        ? "#e3b505"
                        : i === 1
                        ? "#c0c0c0"
                        : i === 2
                        ? "#cd7f32"
                        : "#333",
                  }}
                >
                  <td style={{ padding: "10px" }}>{i + 1}</td>
                  <td style={{ padding: "10px" }}>{item.username}</td>
                  <td style={{ padding: "10px" }}>{item.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
