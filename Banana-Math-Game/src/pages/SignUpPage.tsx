import { useState, type ChangeEvent } from "react";

// @ts-ignore: Module '../firebase/config' has no type declarations
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import SignUpPageBg from "../assets/LoginPage.png";


function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signupUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        score: 0,
        completedLevel: "Easy",
      });
      alert("Account created successfully!");
    } catch (error: any) {
      console.error("Error creating account:", error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${SignUpPageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
      }}
    >
      {/* Overlay for better contrast */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)", // dim overlay
          zIndex: 1,
        }}
      ></div>

         {/* Signup Box */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(199, 233, 210, 0.9)",
          padding: "40px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(150, 81, 81, 0.2)",
          width: "400px",
          height: "450px",
        }}
      >

        <h2
          style={{
            color: "#3d7f59",
            fontSize: "50px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            marginBottom: "70px",
          }}
        >
          Sign Up
        </h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          style={{
            display: "block",
            width: "75%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          style={{
            display: "block",
            width: "75%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          style={{
            display: "block",
            width: "75%",
            marginBottom: "70px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={signupUser}
          style={{
            width: "35%",
            padding: "10px",
            backgroundColor: "#3d7f59",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignUp;

