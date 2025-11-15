import { useEffect, useState } from "react";
// @ts-ignore: Module '../firebase/config' has no type declarations
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import BackgroundImg from "../assets/loginpage.png";

interface UserData {
  username: string;
  completedLevel: string;
  score: number;
}

function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert("Please log in first!");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          console.log("No user data found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
        position: "fixed",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(174, 241, 195, 0.56)",
          padding: "50px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          width: "400px",
          backdropFilter: "blur(8px)",
           position: "relative",
          marginLeft: "20px",
          marginRight: "300px",
          marginBottom: "50px",
        }}
      >
        <h2
          style={{
            color: "#2b6e46",
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "25px",
          }}
        >
          My Profile 👤
        </h2>

        {loading ? (
          <p style={{ color: "#555" }}>Loading profile...</p>
        ) : userData ? (
          <div>
            <p
              style={{
                fontSize: "20px",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              <strong>Username:</strong> {userData.username}
            </p>
            <p
              style={{
                fontSize: "20px",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              <strong>Completed Level:</strong> {userData.completedLevel}
            </p>
            <p
              style={{
                fontSize: "20px",
                color: "#333",
              }}
            >
              <strong>Score:</strong> {userData.score}
            </p>
          </div>
        ) : (
          <p style={{ color: "red" }}>No user data found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
