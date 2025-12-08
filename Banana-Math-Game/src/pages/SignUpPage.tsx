import { useState, type ChangeEvent } from "react";

// @ts-ignore: Module '../firebase/config' has no type declarations
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import SignUpPageBg from "../assets/LoginPage.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleLogo from "../assets/google-logo.png";
function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    console.log("SignUp attempt with:", { email, username, password, confirmPassword });
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
console.log("Email validation passed.");
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
console.log("Password confirmation passed.");
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#])[A-Za-z0-9@#]{6,12}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be between 6 and 12 characters and include at least one uppercase letter, one number, and one special character (@ or #).",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      return;
    }
console.log("Password strength validation passed.");
    try {
      console.log("Attempting to create user with email:", email, password);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
 console.log("User created with UID:", user.uid);

    //  Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        score: 0,
        completedLevel: "Easy",
      });
// console.log("User document created in Firestore for UID:", user.uid);
//       await updateProfile(user, {
//         displayName: username,
//       });
      console.log("Profile updated with username:", username);

      toast.success(`${username} successfully signed up!`, {
        position: "top-center",
        autoClose: 3000,
      });
console.log("User created and profile updated:", user);
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage.includes("email already in use")) {
        console.log("Email already in use error caught.");
      }

      if (errorMessage.includes("email already in use"))
     {
        toast.error("This email is already registered.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };
    const handleLoginClick = () => {
    navigate("/login"); // Navigate to the login page directly
  };

    const handleGoogleSignUp = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        
        // Update the user's profile with the username
        updateProfile(user, {
          displayName: user.displayName, // Set the displayName to the user's name from Google
        }).then(() => {
          // Successfully updated user profile
          toast.success(`${user.displayName} successfully signed up with Google!`, { // Show toast message
            position: "top-center",
            autoClose: 3000, // Auto close after 3 seconds
          });
          navigate("/login"); // Navigate to login page after successful sign-up
        }).catch((error) => {
          const errorMessage = error.message;
          alert(`Error updating profile: ${errorMessage}`);
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(`Error: ${errorMessage}`);
      });
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(174, 241, 195, 0.56)",
          padding: "70px 40px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          width: "360px",
          height: "auto",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            color: "#2e7d32",
            fontSize: "50px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            marginBottom: "40px",
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
            width: "95%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            color: "black",
          }}
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          style={{
            display: "block",
            width: "95%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            color: "black",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          style={{
            display: "block",
            width: "95%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            color: "black",
            backdropFilter: "white(10px)",
          }}

        />

        <input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          style={{
            display: "block",
            width: "95%",
            marginBottom: "40px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
             backgroundColor: "white",
             color: "black",
          }}
        />

        <button
          onClick={handleSignUp}
          style={{
            width: "40%",
            padding: "15px",
            backgroundColor: "#095b2bff",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </button><br/><br/>
          <button
          onClick={handleGoogleSignUp}
          style={{
            backgroundColor: "#ffffff2f",
            color: "#2e7d32",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "5px 28px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
            margin: "0 auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <img src={GoogleLogo} alt="Google Logo" style={{ width: "30px", height: "30px" }} />
          SignUp  with Google
        </button>


        <p style={{ marginTop: "20px", fontSize: "14px", color: "#2e7d32" }}>
       Already have an account?{" "}
  <span
    style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
    onClick={() => navigate("/login")}
  >
     Log In
  </span>
</p>
      </div>
    </div>
  );
}

export default SignUp;