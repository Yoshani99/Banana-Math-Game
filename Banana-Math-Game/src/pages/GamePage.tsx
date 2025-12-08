import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import { db, auth } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

import GamePageBg from "../assets/LoginPage.png";
import { useLocation, useNavigate } from "react-router-dom";
import { style } from "framer-motion/client";
import { color } from "framer-motion";

// ✅ Loader Component
const Loader: React.FC = () => (
  <div className="flex items-center justify-center w-full h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600" />
  </div>
);

type LevelType = "Easy" | "Medium" | "Hard";

interface GamePageProps {
  selectedLevel: LevelType;
}

function GamePage() {
  const location = useLocation();

  const selectedLevel: "Easy" | "Medium" | "Hard" =
    location.state?.selectedLevel || "Easy"; // ✅ REAL VALUE

  console.log("✅ Selected Level in GamePage:", selectedLevel);
  // ✅ Level Config
  const levelTimes: Record<LevelType, number> = {
    Easy: 20,
    Medium: 15,
    Hard: 8,
  };

  const levelLives: Record<LevelType, number> = {
    Easy: 5,
    Medium: 3,
    Hard: 3,
  };

  // ✅ FIXED STATE TYPES
  const [timeLeft, setTimeLeft] = useState<number>(levelTimes[selectedLevel]);
  const [lives, setLives] = useState<number>(levelLives[selectedLevel]);
  const [imageData, setImageData] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0); // ✅ FIXED

  const firstTimeDown = useRef(false);
  const navigate = useNavigate();

  // ✅ Save Score
  const saveScore = async (scoreToAdd: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const username = user.displayName || "Player";
      const userId = user.uid;

      const userRef = doc(db, "scores", username);
      const userDoc = await getDoc(userRef);

      let newScore = scoreToAdd;

      if (userDoc.exists()) {
        newScore += userDoc.data().highestScore || 0;
      }

      await setDoc(userRef, {
        highestScore: newScore,
        username,
        userId,
      });

      setCurrentScore(newScore);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // ✅ Fetch Puzzle
  const fetchImage = async () => {
    try {
      const res = await fetch("https://marcconrad.com/uob/banana/api.php");
      const data = await res.json();

      setImageData(data);
      setIsImageLoaded(true);
      setTimeLeft(levelTimes[selectedLevel]);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  // ✅ Start Game
  useEffect(() => {
    if (!hasStarted) {
      fetchImage();
      setHasStarted(true);
    }
  }, [hasStarted]);

  // ✅ TIMER WORKING
  useEffect(() => {
    if (lives === 0 || !isImageLoaded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;

        if (!firstTimeDown.current) {
          firstTimeDown.current = true;
          return 0;
        }

        if (lives > 1) {
          setLives((l) => l - 1);
          firstTimeDown.current = false;
          fetchImage();
          return levelTimes[selectedLevel];
        } else {
          setLives(0);
          saveScore(currentScore);
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lives, selectedLevel, isImageLoaded, currentScore]);

  // ✅ Answer Handling
  const handleAnswerSelection = (number: number) => {
    if (lives === 0 || !imageData) return;

    setSelectedAnswer(number);

    if (number === imageData.solution) {
      const scoreBonus =
        selectedLevel === "Easy" ? 10 : selectedLevel === "Medium" ? 20 : 35;

      const newScore = currentScore + scoreBonus;
      setCurrentScore(newScore);
      saveScore(scoreBonus);
      setIsCorrect(true);

      setTimeout(() => {
        fetchImage();
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1000);
    } else {
      setIsCorrect(false);
      setIncorrectAnswers((prev) => prev + 1);

      if (lives > 1) setLives((prev) => prev - 1);
      else setLives(0);

      setTimeout(() => {
        fetchImage();
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  // ✅ Restart Game FIXED
  const handleRestart = () => {
    setLives(levelLives[selectedLevel]);
    setTimeLeft(levelTimes[selectedLevel]);
    setIncorrectAnswers(0);
    setCurrentScore(0);
    fetchImage();
  };

  return (
    <div
      className="flex flex-col items-center justify-start w-screen h-screen p-6"
      style={{
        backgroundImage: `url(${GamePageBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        fontFamily: "Poppins, sans-serif",
        width: "100vw",
        height: "100vh",


        // position: "fixed",
      }}
    >
      {/* Header */}
      <div className="bg-yellow-500 text-white px-8 py-4 rounded-xl shadow-xl mb-8" >
        <h2 className="text-6xl font-extrabold drop-shadow-lg capitalize">
          {selectedLevel} Level
        </h2>
      </div>

      {/* Game Box */}
      <div
        className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl border-4 border-yellow-400 w-[750px]"
        style={{
          fontFamily: "'Poppins', sans-serif",
          position: "relative",
          marginLeft: "200px",
        }}
      >
        {/* Stats */}
        <div
          className="flex justify-between mb-4 p-4 rounded-xl shadow-md border border-gray-400"
          style={{
            color: "black",
            width: "660px",   // ✅ FIXED WIDTH
            backgroundColor: "white", // ✅ BOX FEEL
          }}
        >
          <div className="px-4 py-2 rounded-lg border border-gray-400">
            Lives: {lives > 0 ? "❤️".repeat(lives) : "💀 Game Over"}
          </div>

          <div className="px-4 py-2 rounded-lg border border-gray-400">
            Time: {timeLeft}s
          </div>

          <div className="px-4 py-2 rounded-lg border border-gray-400">
            Score: {currentScore}
          </div>
        </div>

        {/* Puzzle */}
        <div className="flex justify-center mb-6">
          {imageData ? (
            <img
              src={imageData.question}
              alt="Math Puzzle"
              className="rounded-xl shadow-xl w-[420px]"
            />
          ) : (
            <Loader />
          )}
        </div>

        {/* Answers */}
        {/* <div className="flex justify-center mb-6 flex-wrap gap-4">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleAnswerSelection(i)}
              className={`w-[70px] h-[55px] text-2xl font-bold rounded-xl shadow-lg transition-all duration-300 ${selectedAnswer === i
                ? isCorrect
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
                : "bg-yellow-500 text-white hover:bg-yellow-700"
                }`}
            >
              {i}
            </button>
          ))}
        </div> */}

        {/* Feedback
        {isCorrect !== null && (
          <div className="text-center mb-6 text-3xl font-bold">
            {isCorrect ? (
              <p className="text-green-700">✅ Correct!</p>
            ) : (
              <p className="text-red-600">❌ Try Again!</p>
            )}
          </div>
        )} */}

        {/* Controls */}
        {/* <div className="text-center">
          <button
            onClick={handleRestart}
            className="bg-green-600 text-white text-2xl px-8 py-4 rounded-xl shadow-lg hover:bg-green-800"
          >
            🔄 Restart
          </button>

          <p className="mt-5 text-[25px] text-blue-900">
            Back?{" "}
            <span
              className="underline cursor-pointer font-bold"
              onClick={() => navigate("/mainmenu")}
            >
              Main Menu
            </span>
          </p>
        </div> */}
      </div>
      <div className="flex justify-center mb-6 flex-wrap gap-4" style={{ position: "absolute", top: "100px", left: "900px" }}>

        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleAnswerSelection(i)}
              className={`w-[70px] h-[55px] text-2xl font-bold rounded-xl shadow-lg transition-all duration-300 ${selectedAnswer === i
                ? isCorrect
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
                : "bg-yellow-500 text-white hover:bg-yellow-700"
                }`} style={{backgroundColor:"white", color:"black"}}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleRestart}
            className="bg-green-600 text-white text-2xl px-8 py-4 rounded-xl shadow-lg hover:bg-green-800" style={{backgroundColor:"white", color:"black"}}
          >
            🔄 Restart
          </button>

          <p className="mt-5 text-[25px] text-blue-900">
            Back?{" "}
            <span
              className="underline cursor-pointer font-bold" style={{cursor:"pointer"}}
              onClick={() => navigate("/mainmenu")}
            >
              Main Menu
            </span>
          </p>
        </div>

          {/* Feedback */}
        {isCorrect !== null && (
          <div className="text-center mb-6 text-3xl font-bold">
            {isCorrect ? (
              <p className="text-green-700">✅ Correct!</p>
            ) : (
              <p className="text-red-600">❌ Try Again!</p>
            )}
          </div>
        )}

      </div>

    </div>

  );
}

export default GamePage;



// import React, { useState, useEffect, useRef } from "react";
// // @ts-ignore
// import { db, auth } from "../firebase/config";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// import GamePageBg from "../assets/LoginPage.png";
// import { color } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// // Loader Component(loading animation)
// const Loader: React.FC = () => (
//   <div className="flex items-center justify-center w-full h-48">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600" />
//   </div>
// );

// type LevelType = "Easy" | "Medium" | "Hard";

// interface GamePageProps {
//   selectedLevel: LevelType;
// }


// function GamePage({selectedLevel}: GamePageProps  ) {
//   const levelTimes: Record<LevelType, number> = { Easy: 20, Medium: 15, Hard: 8 };
//   const levelLives: Record<LevelType, number> = { Easy: 5, Medium: 3, Hard: 3 };

//   //countdown timer and lives
//   const [timeLeft, setTimeLeft] = useState();
//   const [lives, setLives] = useState();

//   //puzzle image and answer states
//   const [imageData, setImageData] = useState<any>(null);

//   //selected answer and correctness states
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

//   //track if the answer is correct
//   const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

//   //image loading and game start states
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);

//   //score and incorrect answers states
//   const [currentScore, setCurrentScore] = useState(0);



//   const firstTimeDown = useRef(false);
//   const navigate = useNavigate();
//   // firebase Score Save function
//   const saveScore = async (scoreToAdd: number) => {
//     try {
//       console.log("Saving Score:", scoreToAdd);
//       const user = auth.currentUser;
//       console.log(" Current User:", user);
//       if (!user) return;

//       console.log("User is authenticated:", user.uid);
//       const username = user.displayName || "Player";
//       const userId = user.uid;

//       console.log("Username:", username, "UserID:", userId);
//       const userRef = doc(db, "scores", username);
//       console.log("User Document Reference:", userRef);

//       const userDoc = await getDoc(userRef);
//       console.log(" Retrieved User Document:", userDoc.exists() ? userDoc.data() : "No document found");
//       let newScore = scoreToAdd;

//       if (userDoc.exists()) {
//         newScore += userDoc.data().highestScore || 0;
//       }
//       console.log("New Score to be saved:", newScore);
//       await setDoc(userRef, {
//         highestScore: newScore,
//         username,
//         userId,
//       });
//       console.log("Score saved successfully for", username);

//       setCurrentScore(newScore);
//     } catch (error) {
//       console.error(" Error saving score:===>", error);
//     }
//   };

//   // Fetch Puzzle
//   const fetchImage = async () => {
//     try {
//       const res = await fetch("https://marcconrad.com/uob/banana/api.php");
//       const data = await res.json();
//       setImageData(data);
//       setIsImageLoaded(true);
//       setHasStarted(true);
//     } catch (error) {
//       console.error("Error fetching question:", error);
//     }
//   };

//   useEffect(() => {
//     if (!hasStarted) fetchImage();
//   }, [hasStarted]);


//   // Timer
//   useEffect(() => {
//     if (lives === 0 || !isImageLoaded) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev > 0) return prev - 1;

//         if (!firstTimeDown.current) {
//           firstTimeDown.current = true;
//           return 0;
//         }

//         if (lives > 1) {
//           setLives((l) => l - 1);
//           firstTimeDown.current = false;
//           fetchImage();
//           return levelTimes[selectedLevel];
//         } else {
//           setLives(0);
//           saveScore(currentScore);
//           clearInterval(timer);
//         }

//         return 0;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [lives, selectedLevel, isImageLoaded, currentScore]);


//   // Answer Click
//   const handleAnswerSelection = (number: number) => {
//     if (lives === 0 || !imageData) return;

//     setSelectedAnswer(number);

//     if (number === imageData.solution) {
//       const scoreBonus =
//         selectedLevel === "Easy" ? 10 : selectedLevel === "Medium" ? 20 : 35;

//       const newScore = currentScore + scoreBonus;
//       setCurrentScore(newScore);
//       saveScore(scoreBonus);
//       setIsCorrect(true);

//       setTimeout(() => {
//         fetchImage();
//         setSelectedAnswer(null);
//         setIsCorrect(null);
//         setTimeLeft(levelTimes[selectedLevel]);
//       }, 1000);
//     } else {
//       setIsCorrect(false);
//       setIncorrectAnswers((prev) => prev + 1);
//       if (lives > 1) setLives(lives - 1);
//       else setLives(0);

//       setTimeout(() => {
//         fetchImage();
//         setSelectedAnswer(null);
//         setIsCorrect(null);
//         setTimeLeft(levelTimes[selectedLevel]);
//       }, 1000);
//     }
//   };


//   // Restart Game
//   const handleRestart = () => {
//     setLives(levelLives[]);
//     setTimeLeft(levelTimes[selectedLevel]);
//     setIncorrectAnswers(0);
//     setCurrentScore(0);
//     fetchImage();
//   };


//   return (
//     <div
//       className="flex flex-col items-center justify-start w-screen h-screen p-0"
//       style={{
//         backgroundImage: `url(${GamePageBg})`,
//         backgroundSize: "cover",
//       ////  backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         fontFamily: "Poppins, sans-serif",
//         width: "100vw",
//        height: "100vh",
//          position: "fixed",

//       }}
//     >
//       {/* Header */}
//       <div className="bg-yellow-500 text-white px-8 py-4 rounded-xl shadow-xl mb-8">
//         <h2 className="text-6xl font-extrabold drop-shadow-lg capitalize" style={{
//           fontFamily: "'Poppins', sans-serif", position: "relative",
//           marginLeft: "auto",
//         }}>
//           {selectedLevel} Level
//         </h2>
//       </div>

//       {/* Game Box */}
//       <div  style={{ color: "black" ,backgroundColor:"lightyellow" ,width:750 , marginLeft:450} } className="flex justify-center mb-4">
//  <div
//   className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl border-4 border-yellow-400 mx-auto"
//   style={{
//     fontFamily: "'Poppins', sans-serif",
//     marginLeft: "auto",
//     marginRight: "auto",
//   //  marginTop: "100px",
//     width: "750px",
//     // width: "2100px",    // ✅ Correct width
//     // minHeight: "750px" // ✅ Controls height safely
//   }}
// >

//       {/* <div className="bg-gray-100 p-6 rounded-2xl shadow-xl border-2 border-blue-300"> */}

//   {/* MAIN WHITE BOX */}
//  {/* // <div className="bg-black p-6 rounded-xl shadow-lg border border-gray-300"> */}

// <div style={{ color: "black" ,backgroundColor:"lightyellow" ,width:750 } } className="flex justify-center mb-4">


//       {/* Lives */}
//       <div className="px-4 py-2 rounded-lg border border-gray-400">
//         Lives: {lives > 0 ? "❤️".repeat(lives) : "💀 Game Over"}
//       </div>

//       {/* Timer */}
//       <div className="px-4 py-2 rounded-lg border border-gray-400">
//         Time: {timeLeft}s
//       </div>

//       {/* Score */}
//       <div className="px-4 py-2 rounded-lg border border-gray-400">
//         Score: {currentScore}
//       </div>
//       </div>


//         <div className="flex justify-center mb-6 w-[700px]">

//           {imageData ? (
//             <img
//               src={imageData.question}
//               alt="Math Puzzle"
//               className="rounded-xl shadow-xl w-[420px]"
//             />
//           ) : (
//             <Loader />
//           )}
//         </div>

//         <div className="flex justify-center mb-6 flex-wrap gap-4">
//           {Array.from({ length: 10 }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => handleAnswerSelection(i)}
//               className={`w-[70px] h-[55px] text-2xl font-bold rounded-xl shadow-lg transition-all duration-300 ${selectedAnswer === i
//                   ? isCorrect
//                     ? "bg-green-600 text-white"
//                     : "bg-red-600 text-white"
//                   : "bg-yellow-500 text-white hover:bg-yellow-700"
//                 }`}
//             >
//               {i}
//             </button>
//           ))}
//         </div>

//         {isCorrect !== null && (
//           <div className="text-center mb-6 text-3xl font-bold">
//             {isCorrect ? (
//               <p className="text-green-700">✅ Correct!</p>
//             ) : (
//               <p className="text-red-600">❌ Try Again!</p>
//             )}
//           </div>
//         )}

//         <div className="text-center">
//           <button
//             onClick={handleRestart}
//             className="bg-green-600 text-white text-2xl px-8 py-4 rounded-xl shadow-lg hover:bg-green-800"
//           >
//             🔄 Restart
//           </button>

//           <p style={{ marginTop: "20px", fontSize: "25px", color: "#210989ff" }}>
//           Back?{" "}
//           <span
//             style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
//             onClick={() => navigate("/mainmenu")}
//           >
//             Main Menu
//           </span>
//         </p>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }



// export default GamePage;




// import React, { useState, useEffect, useRef } from "react";
// // @ts-ignore
// import { db, auth } from "../firebase/config";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// import GamePageBg from "../assets/LoginPage.png";
// import { useNavigate } from "react-router-dom";

// /* ------------------- Loader Component ------------------- */
// const Loader = () => (
//   <div className="flex items-center justify-center w-full h-48">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600" />
//   </div>
// );

// /* ------------------- Game Page ------------------- */
// function GamePage({ selectedLevel = "easy" }) {
//   /* ------------------- Game Levels ------------------- */
//   const levelTimes = {
//     "easy": 20,
//    "medium": 15,
//     "hard": 8,
//   };

//   const levelLives = {
//     easy: 5,
//     medium: 3,
//     hard: 3,
//   };

//   /* ------------------- State ------------------- */
//   const [timeLeft, setTimeLeft] = useState(levelTimes[selectedLevel]);
//   const [lives, setLives] = useState(levelLives[selectedLevel]);
//   const [imageData, setImageData] = useState(null);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);
//   const [currentScore, setCurrentScore] = useState(0);

//   const firstTimeDown = useRef(false);
//   const navigate = useNavigate();

//   /* ------------------- Save Score ------------------- */
//   const saveScore = async (scoreToAdd) => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return;

//       const username = user.displayName || "Player";
//       const userId = user.uid;

//       const userRef = doc(db, "scores", username);
//       const userDoc = await getDoc(userRef);

//       let newScore = scoreToAdd;

//       if (userDoc.exists()) {
//         newScore += userDoc.data().highestScore || 0;
//       }

//       await setDoc(userRef, {
//         highestScore: newScore,
//         username,
//         userId,
//       });

//       setCurrentScore(newScore);
//     } catch (error) {
//       console.error("Error saving score:", error);
//     }
//   };

//   /* ------------------- Fetch Puzzle ------------------- */
//   const fetchImage = async () => {
//     try {
//       const res = await fetch("https://marcconrad.com/uob/banana/api.php");
//       const data = await res.json();
//       setImageData(data);
//       setIsImageLoaded(true);
//       setHasStarted(true);
//     } catch (error) {
//       console.error("Error fetching question:", error);
//     }
//   };

//   useEffect(() => {
//     if (!hasStarted) fetchImage();
//   }, [hasStarted]);

//   /* ------------------- Timer Logic ------------------- */
//   useEffect(() => {
//     if (lives === 0 || !isImageLoaded) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev > 0) return prev - 1;

//         if (!firstTimeDown.current) {
//           firstTimeDown.current = true;
//           return 0;
//         }

//         if (lives > 1) {
//           setLives((l) => l - 1);
//           firstTimeDown.current = false;
//           fetchImage();
//           return levelTimes[selectedLevel];
//         } else {
//           setLives(0);
//           saveScore(currentScore);
//           clearInterval(timer);
//         }

//         return 0;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [lives, selectedLevel, isImageLoaded, currentScore]);

//   /* ------------------- Handle Answer ------------------- */
//   const handleAnswerSelection = (number) => {
//     if (lives === 0 || !imageData) return;

//     setSelectedAnswer(number);

//     const scoreBonus =
//       selectedLevel === "easy" ? 10 :
//       selectedLevel === "medium" ? 20 : 35;

//     if (number === imageData.solution) {
//       const newScore = currentScore + scoreBonus;
//       setCurrentScore(newScore);
//       saveScore(scoreBonus);
//       setIsCorrect(true);

//       setTimeout(() => {
//         fetchImage();
//         setSelectedAnswer(null);
//         setIsCorrect(null);
//         setTimeLeft(levelTimes[selectedLevel]);
//       }, 1000);
//     } else {
//       setIsCorrect(false);
//       setLives((prev) => (prev > 1 ? prev - 1 : 0));

//       setTimeout(() => {
//         fetchImage();
//         setSelectedAnswer(null);
//         setIsCorrect(null);
//         setTimeLeft(levelTimes[selectedLevel]);
//       }, 1000);
//     }
//   };

//   /* ------------------- Restart ------------------- */
//   const handleRestart = () => {
//     setLives(levelLives[selectedLevel]);
//     setTimeLeft(levelTimes[selectedLevel]);
//     setCurrentScore(0);
//     fetchImage();
//   };

//   /* ------------------- UI ------------------- */
//   return (
//     <div
//       className="flex flex-col items-center justify-start w-screen h-screen p-6"
//       style={{
//         backgroundImage: `url(${GamePageBg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         fontFamily: "Poppins, sans-serif",
//       }}
//     >
//       {/* ---------------- Header ---------------- */}
//       <div className="bg-yellow-500 text-white px-8 py-4 rounded-xl shadow-xl mb-8">
//         <h2 className="text-5xl font-extrabold drop-shadow-lg capitalize">
//           {selectedLevel} Level
//         </h2>
//       </div>

//       {/* ---------------- Game Box ---------------- */}
//       <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl border-4 border-yellow-400 mx-auto w-[750px] max-w-[95%]">

//         {/* Top Status Bar */}
//         <div className="flex justify-between bg-yellow-100 p-4 rounded-xl mb-6 text-black font-bold text-xl">
//           <div>Lives: {lives > 0 ? "❤️".repeat(lives) : "💀 Game Over"}</div>
//           <div>Time: {timeLeft}s</div>
//           <div>Score: {currentScore}</div>
//         </div>

//         {/* Image */}
//         <div className="flex justify-center mb-6">
//           {imageData ? (
//             <img
//               src={imageData.question}
//               alt="Math Puzzle"
//               className="rounded-xl shadow-xl w-[420px]"
//             />
//           ) : (
//             <Loader />
//           )}
//         </div>

//         {/* Answers */}
//         <div className="flex justify-center mb-6 flex-wrap gap-4">
//           {Array.from({ length: 10 }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => handleAnswerSelection(i)}
//               className={`w-[70px] h-[55px] text-2xl font-bold rounded-xl shadow-lg transition-all duration-300 ${
//                 selectedAnswer === i
//                   ? isCorrect
//                     ? "bg-green-600 text-white"
//                     : "bg-red-600 text-white"
//                   : "bg-yellow-500 text-white hover:bg-yellow-700"
//               }`}
//             >
//               {i}
//             </button>
//           ))}
//         </div>

//         {/* Result */}
//         {isCorrect !== null && (
//           <div className="text-center mb-6 text-3xl font-bold">
//             {isCorrect ? (
//               <p className="text-green-700">✅ Correct!</p>
//             ) : (
//               <p className="text-red-600">❌ Try Again!</p>
//             )}
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="text-center">
//           <button
//             onClick={handleRestart}
//             className="bg-green-600 text-white text-2xl px-8 py-4 rounded-xl shadow-lg hover:bg-green-800"
//           >
//             🔄 Restart
//           </button>

//           <p className="mt-6 text-[25px] text-[#210989ff]">
//             Back?{" "}
//             <span
//               className="underline cursor-pointer font-bold"
//               onClick={() => navigate("/mainmenu")}
//             >
//               Main Menu
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GamePage;
