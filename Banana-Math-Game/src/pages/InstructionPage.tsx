import { useNavigate } from "react-router-dom";
import InstructionPageBg from "../assets/LoginPage.png";



function InstructionPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${InstructionPageBg})`,
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        width: "100vw",
        position: "fixed",
      }}
    >
      <div
        style={{
          maxWidth: "750px",
          backgroundColor: "rgba(174, 241, 195, 0.56)",
          borderRadius: "20px",
          padding: "40px 50px",
          textAlign: "center",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
          position: "relative",
          marginLeft: "20px",
          marginRight: "300px",
          marginBottom: "80px",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            color: "#3b137fff",
            marginBottom: "35px",
            textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
          }}
        >
        How to Play
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#333",
            lineHeight: "1.8",
            textAlign: "left",
            marginBottom: "30px",
          }}
        >
          <strong>1.)</strong> Pick a Level - Easy, Medium, or Hard.
          <br />
          <strong>2.)</strong> Solve Math Puzzles - Answer questions to earn points.
          <br />
          <strong>3.)</strong> Win & Learn - Score high and become a{" "}
          <b>BanaMath Champion!</b>
        </p>

        <h2
          style={{
            fontSize: "40px",
            color: "#0b5c2dff",
            marginBottom: "15px",
            textShadow: "1px 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          Tips & Tricks
        </h2>

        <p
          style={{
            fontSize: "17px",
            color: "#333",
            textAlign: "left",
            lineHeight: "1.8",
            marginBottom: "40px",
          }}
        >
          <strong>1.)</strong> Stay focused to solve puzzles faster and earn more points!
          <br />
          <strong>2.)</strong> Try to complete challenges quickly for bonus time and points.
          <br />
          <strong>3.)</strong> Use the hints if you get stuck (limited hints available per level).
          <br />
          <strong>4.)</strong> Review the instructions before starting to get the best results.
          <br />
          <br />
           
        </p>

        
      </div>
    </div>
  );
}

export default InstructionPage;
