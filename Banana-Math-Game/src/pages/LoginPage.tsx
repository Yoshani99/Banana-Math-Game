import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, type ChangeEvent } from "react";
// @ts-ignore: Module '../firebase/config' has no type declarations
import { auth } from "../firebase/config";
import LoginPageImg from "../assets/loginpage.png";
import GoogleLogo from "../assets/google-logo.png";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("❌ Invalid credentials");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${LoginPageImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(174, 241, 195, 0.56)",
          padding: "50px 40px",
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
            fontSize: "44px",
            fontWeight: 700,
            marginBottom: "25px",
            letterSpacing: "1px",
            textShadow: "2px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          Login
        </h2>

        <input
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "20px",
            padding: "12px",
            borderRadius: "10px",
            border: "2px solid #c5e1a5",
            fontSize: "16px",
            outline: "none",
            transition: "0.3s",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #81c784")}
          onBlur={(e) => (e.target.style.border = "2px solid #c5e1a5")}
        />

        <input
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "30px",
            padding: "12px",
            borderRadius: "10px",
            border: "2px solid #c5e1a5",
            fontSize: "16px",
            outline: "none",
            transition: "0.3s",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #81c784")}
          onBlur={(e) => (e.target.style.border = "2px solid #c5e1a5")}
        />

        <button
          onClick={loginUser}
          style={{
            width: "40%",
            padding: "12px",
            backgroundColor: "#43a047",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2e7d32")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#43a047")
          }
        >
          Login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="bg-white text-white font-bold text-xl px-6 py-3 rounded-lg mt-6 shadow-lg flex items-center justify-center font-dancingScript"
        >
          {/* Google Logo */}
          <img src={GoogleLogo} alt="Google Logo" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
