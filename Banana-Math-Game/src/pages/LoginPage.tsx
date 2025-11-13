import {  signInWithEmailAndPassword } from "firebase/auth";
import { useState, type ChangeEvent } from "react";
// @ts-ignore: Module '../firebase/config' has no type declarations
import {auth} from "../firebase/config";
import LoginPageImg from "../assets/loginpage.png";

function LoginPage() {
    const [email, setEmail] = useState<string> ("");

    const [password ,setPassword] = useState<string> ("");



    const handleEmnailChange =(e: ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value);
    };

    const handlePasswordChange =(e: ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.target.value);
    };

    const loginUser = async () => {
        try {
            await signInWithEmailAndPassword (auth ,email, password);
            alert("Login successful!");
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Invalid credentials");
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${LoginPageImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding:0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                  backgroundColor: "rgba(208, 194, 194, 0.8)",
                  padding: "40px",
                  borderRadius: "15px",
                  textAlign: "center",
                  boxShadow: "0 0 20px rgba(239, 227, 227, 0.4)",
                  width: "320px",
                }}
            >
                <h2 style={{ color: "#062412ff", fontSize: "50px", fontFamily: "Poppins, sans-serif" }}>Login</h2>


            <input
                placeholder= "Email"
                type="email"
                value={email}
                onChange={handleEmnailChange}

                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "15px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "3px solid #ceb7b7ff",
          }}
            />


            <input
                placeholder= "Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}

                style={{
                   display: "block",
                   width: "100%",
                   marginBottom: "50px",
                   padding: "10px",
                   borderRadius: "8px",
                   border: "1px solid #ccc",
            }}
            />

            <button
               onClick={loginUser}
               style={{
                 width: "30%",
                 padding: "10px",
                 backgroundColor: "#cd5cc4bc",
                 border: "none",
                 borderRadius: "25px",
                 cursor: "pointer",
                 color: "white",
                 fontWeight: "bold",
          }}
          >
            Login

            </button>
            </div>
          </div>
        
    );
}    

export default LoginPage;