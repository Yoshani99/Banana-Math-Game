import { useState, type ChangeEvent } from "react";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";


//  import eye icons(React, Firebase Auth, Firestore, Navigation, Toast, Google Logo, Password Eye Icons import)

import { setDoc, doc } from "firebase/firestore";
import SignUpPageBg from "../assets/LoginPage.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogo from "../assets/google-logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa"; //  import eye icons


/*use state variables */
function SignUp() {
  const [email, setEmail] = useState<string>("");
  
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // NORMAL EMAIL SIGNUP
  const handleSignUp = async () => {
    try {
      if (!username || !email || !password || !confirmPassword) {
        toast.error("All fields are required!");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#])[A-Za-z0-9@#]{6,12}$/;

      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must contain 1 uppercase letter, 1 number & 1 special (@ or #)"
        );
        return;
      }

      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log("User profile updated with username:", username);
      console.log("User UID:", user.uid);
      console.log("User Email:", user.email);
      console.log("Storing user data in Firestore...");


      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      
        createdAt: new Date(),
        userId: user.uid,
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak.");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

    await new Promise((resolve) => setTimeout(resolve, 200));
      console.log("User profile updated with username:", username);
      console.log("User UID:", user.uid);
      console.log("User Email:", user.email);
      console.log("Storing user data in Firestore...");

      
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        score: 0,
        completedLevel: "Easy",
        createdAt: new Date(),
      });


      toast.success("Signed up with Google successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Google sign-in failed.");
    } finally {
      setLoading(false);
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(174, 241, 195, 0.56)",
          padding: "60px 40px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          width: "360px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            color: "#2e7d32",
            fontSize: "42px",
            fontWeight: 800,
            marginBottom: "30px",
          }}
        >
          Sign Up
        </h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          style={inputStyle}
        />
        {/* <div style={{ position: "relative", width: "100%", margin: "0 auto 20px" }}></div> */}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          style={inputStyle}
        />


        {/* Password with Eye Toggle */}
        <div style={{ position: "relative", width: "100%", margin: "0 auto 20px" }}>
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#2e7d32",
              fontSize: "18px",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password with Eye Toggle */}
        <div style={{ position: "relative", width: "100%", margin: "0 auto 20px" }}>
          <input
            placeholder="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ ...inputStyle }}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#2e7d32",
              fontSize: "18px",
            }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          style={{
            width: "50%",
            padding: "14px",
            backgroundColor: "#095b2b",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
            marginTop: "15px",
          }}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <br />
        <br />

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          style={{
            backgroundColor: "#ffffff2f",
            color: "#2e7d32",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "6px 28px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
            margin: "0 auto",
          }}
        >
          <img
            src={GoogleLogo}
            alt="Google Logo"
            style={{ width: "28px", height: "28px" }}
          />
          Sign Up with Google
        </button>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#2e7d32" }}>
          Already have an account?{" "}
          <span
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/login")}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

// Input Style Reusable
const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "15px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  backgroundColor: "white",
  color: "black",
};

export default SignUp;
