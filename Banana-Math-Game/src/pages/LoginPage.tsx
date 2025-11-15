import { useState, type ChangeEvent } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// @ts-ignore: Module '../firebase/config' has no type declarations
import { auth } from "../firebase/config";
import LoginPageImg from "../assets/loginpage.png";
import GoogleLogo from "../assets/google-logo.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const loginUser = async () => {
    console.log("Attempting to log in with email:", email, "and password:", password);

    if (!email) {
      toast.error("Please enter your email.", { position: "top-center", autoClose: 3000 });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", { position: "top-center", autoClose: 3000 });
      return;
    }

    if (!password) {
      toast.error("Please enter your password.", { position: "top-center", autoClose: 3000 });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("savedEmail", user.email || "");
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", user.email || "");

      toast.success("Successfully logged in!", { position: "top-center", autoClose: 3000 });
      navigate("/mainmenu");
    } catch (error: any) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        localStorage.setItem("savedEmail", user.email || "");
        user.getIdToken().then((token) => {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userEmail", user.email || "");
          localStorage.setItem("username", user.displayName || "");

          toast.success("Successfully logged in with Google!", {
            position: "top-center",
            autoClose: 3000,
          });

          navigate("/mainmenu");
        });
      })
      .catch((error) => {
        toast.error(error.message, { position: "top-center", autoClose: 3000 });
      });
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
          padding: "90px 40px",
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
            fontSize: "50px",
            fontWeight: 800,
            marginBottom: "30px",
            letterSpacing: "1px",
            fontFamily: "'Poppins', sans-serif",
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
            backgroundColor: "white",
            color: "black",
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
             backgroundColor: "white",
             color: "black",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #81c784")}
          onBlur={(e) => (e.target.style.border = "2px solid #c5e1a5")}
        />

        <button
          onClick={loginUser}
          style={{
            width: "30%",
            padding: "11px",
            backgroundColor: "#3d7f59",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            boxShadow: "0 5px 15px rgba(228, 177, 177, 0.3)",
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

        <br /><br />

        <button
          onClick={handleGoogleLogin}
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
          Sign in with Google
        </button>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#2e7d32" }}>
          Don't have an account?{" "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/signup")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;