import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("User");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || user.email || "User");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    toast.success(`${username} successfully logged out!`, {
      position: "top-center",
      autoClose: 3000,
    });

    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-secondary text-black font-bold text-2xl py-3 rounded-full w-14 h-14 mt-auto transition-transform duration-150 active:scale-90 hover:bg-green-600 hover:scale-105"
      >
        ⬅️
      </button>
    </div>
  );
};

export default LogoutButton;