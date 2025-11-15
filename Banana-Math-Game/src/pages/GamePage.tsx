// import { useLocation } from "react-router-dom";
// import React, { useEffect, useState, useRef } from "react";
// import GamePageBg from "../assets/LoginPage.png";

// type LevelType = "Easy" | "Medium" | "Hard";

// export default function GamePage() {
//   const location = useLocation();
//   const selectedLevel: LevelType = location.state?.selectedLevel || "Easy";

//   const levelTimes = { Easy: 20, Medium: 15, Hard: 8 };
//   const levelLives = { Easy: 5, Medium: 3, Hard: 3 };

//   const [timeLeft, setTimeLeft] = useState(levelTimes[selectedLevel]);
//   const [lives, setLives] = useState(levelLives[selectedLevel]);
//   const [imageData, setImageData] = useState<any>(null);

//   const fetchImage = async () => {
//     const res = await fetch("https://marcconrad.com/uob/banana/api.php");
//     const data = await res.json();
//     setImageData(data);
//   };

//   useEffect(() => {
//     fetchImage();
//   }, []);

//   return (
//     <div
//       style={{
//         height: "100vh",
//         width: "100vw",
//         backgroundImage: `url(${GamePageBg})`,
//         backgroundSize: "cover",
//         padding: "25px",
//       }}
//     >
//       {/* <h1
//         style={{
//           fontSize: "50px",
//           textAlign: "center",
//           color: "#040904ff",
//           fontWeight: "800",
//           marginBottom: "30px",
//         }}
//       >
//         {selectedLevel} Level
//       </h1> */}

//       <div
//         style={{
//           width: "800px",
//           margin: "0 auto",
//           padding: "40px",
//           backgroundColor: "rgba(36, 136, 51, 0.9)",
//           borderRadius: "20px",
//           textAlign: "center",
//         }}
//       >
//         <h1> {selectedLevel} Level</h1>
//        <div style={{ display: "flex", justifyContent: "center", gap: "140px", fontSize: "24px", fontWeight: "bold" }}>
//   <span>⏳ Time Left: {timeLeft}s</span>
//   <span>❤️ Lives: {"❤️".repeat(lives)}</span>
// </div>

//         {imageData ? (
//           <img src={imageData.question} width={550} height={300} />
//         ) : (
//           <p>Loading puzzle...</p>
//         )}

//         <div style={{ marginTop: "25px" }}>
//           {Array.from({ length: 10 }, (_, i) => (
//             <button
//               key={i}
//               style={{
//                 margin: "8px",
//                 padding: "18px 28px",
//                 fontSize: "15px",
//                 borderRadius: "12px",
//                 backgroundColor: "#ffc107",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "black",
//               }}
//             >
//               {i}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



















import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import { db, auth } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

import GamePageBg from "../assets/LoginPage.png";

// Loader Component
const Loader: React.FC = () => (
  <div className="flex items-center justify-center w-full h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600" />
  </div>
);

type LevelType = "Easy" | "Medium" | "Hard";

interface GamePageProps {
  selectedLevel: LevelType;
}

function GamePage({ selectedLevel }: GamePageProps) {
  const levelTimes: Record<LevelType, number> = { Easy: 20, Medium: 15, Hard: 8 };
  const levelLives: Record<LevelType, number> = { Easy: 5, Medium: 3, Hard: 3 };

  const [timeLeft, setTimeLeft] = useState(levelTimes[selectedLevel]);
  const [lives, setLives] = useState(levelLives[selectedLevel]);
  const [imageData, setImageData] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const firstTimeDown = useRef(false);

  // Save Score
  const saveScore = async (scoreToAdd: number) => {
        try {
    console.log("🔥 Saving Score:", scoreToAdd) ;
    const user = auth.currentUser;
    console.log(" Current User:", user) ;
    if (!user) return;
console.log("🔥 User is authenticated:", user.uid) ;
    const username = user.displayName || "Player";
    const userId = user.uid;
    console.log("🔥 Username:", username, "UserID:", userId) ;
    const userRef = doc(db, "scores", username);
console.log("🔥 User Document Reference:", userRef) ;

      const userDoc = await getDoc(userRef);
      console.log("🔥 Retrieved User Document:", userDoc.exists() ? userDoc.data() : "No document found");
      let newScore = scoreToAdd;

      if (userDoc.exists()) {
        newScore += userDoc.data().highestScore || 0;
      }
console.log("🔥 New Score to be saved:", newScore);
      await setDoc(userRef, {
        highestScore: newScore,
        username,
        userId,
      });
      console.log("🔥 Score saved successfully for", username)  ;

      setCurrentScore(newScore);
    } catch (error) {
      console.error(" Error saving score:===>", error);
    }
  };

  // Fetch Puzzle
  const fetchImage = async () => {
    try {
      const res = await fetch("https://marcconrad.com/uob/banana/api.php");
      const data = await res.json();
      setImageData(data);
      setIsImageLoaded(true);
      setHasStarted(true);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    if (!hasStarted) fetchImage();
  }, [hasStarted]);


  // Timer
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
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lives, selectedLevel, isImageLoaded, currentScore]);


  // Answer Click
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
        setTimeLeft(levelTimes[selectedLevel]);
      }, 1000);
    } else {
      setIsCorrect(false);
      setIncorrectAnswers((prev) => prev + 1);
      if (lives > 1) setLives(lives - 1);
      else setLives(0);

      setTimeout(() => {
        fetchImage();
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(levelTimes[selectedLevel]);
      }, 1000);
    }
  };


  // Restart Game
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
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "Poppins, sans-serif",
        width: "100vw",
        height: "100vh",
        // position: "fixed",
       
      }}
    >
      {/* Header */}
      <div className="bg-yellow-500 text-white px-8 py-4 rounded-xl shadow-xl mb-8">
        <h2 className="text-6xl font-extrabold drop-shadow-lg capitalize" style={{ fontFamily: "'Poppins', sans-serif",position: "relative",
        marginLeft: "250px"}}>
          {selectedLevel} Level
        </h2>
      </div>

      {/* Game Box */}
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl w-[850px] max-w-[95%] border-4 border-yellow-400" style={{ fontFamily: "'Poppins', sans-serif", position: "relative",
        marginLeft: "250px", }}>
        
        <div className="flex justify-between mb-8 text-2xl font-bold">
          <div className="bg-green-200 px-4 py-2 rounded-lg shadow">
            Lives: {lives > 0 ? "❤️".repeat(lives) : "💀 Game Over"}
          </div>

          <div className="bg-yellow-200 px-4 py-2 rounded-lg shadow">
            Time: {timeLeft}s
          </div>

          <div className="bg-blue-200 px-4 py-2 rounded-lg shadow">
            Score: {currentScore}
          </div>
        </div>

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

        <div className="flex justify-center mb-6 flex-wrap gap-4">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleAnswerSelection(i)}
              className={`w-[70px] h-[55px] text-2xl font-bold rounded-xl shadow-lg transition-all duration-300 ${
                selectedAnswer === i
                  ? isCorrect
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                  : "bg-yellow-500 text-white hover:bg-yellow-700"
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        {isCorrect !== null && (
          <div className="text-center mb-6 text-3xl font-bold">
            {isCorrect ? (
              <p className="text-green-700">✅ Correct!</p>
            ) : (
              <p className="text-red-600">❌ Try Again!</p>
            )}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleRestart}
            className="bg-green-600 text-white text-2xl px-8 py-4 rounded-xl shadow-lg hover:bg-green-800"
          >
            🔄 Restart
          </button>
        </div>
      </div>
    </div>
  );
}



 export default GamePage;








// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { auth, db } from "../firebase/config";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// import GamePageBg from "../assets/LoginPage.png";

// const Loader: React.FC = () => (
//   <div className="flex items-center justify-center w-full h-48">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600" />
//   </div>
// );

// type LevelType = "Easy" | "Medium" | "Hard";

// function GamePage() {
//   const location = useLocation();
//   const selectedLevel: LevelType = location.state?.selectedLevel || "Easy";

//   const levelTimes: Record<LevelType, number> = {
//     Easy: 20,
//     Medium: 15,
//     Hard: 8,
//   };

//   const levelLives: Record<LevelType, number> = {
//     Easy: 5,
//     Medium: 3,
//     Hard: 3,
//   };

//   const [timeLeft, setTimeLeft] = useState(levelTimes[selectedLevel]);
//   const [lives, setLives] = useState(levelLives[selectedLevel]);
//   const [imageData, setImageData] = useState<any>(null);
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
//   const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);
//   const [currentScore, setCurrentScore] = useState(0);
//   const [incorrectAnswers, setIncorrectAnswers] = useState(0);

//   const firstTimeDown = useRef(false);

//   // Save score
//   const saveScore = async (scoreToAdd: number) => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const username = user.displayName || "Player";
//     const userRef = doc(db, "scores", username);
//     const userDoc = await getDoc(userRef);

//     let newScore = scoreToAdd;

//     if (userDoc.exists()) {
//       newScore += userDoc.data().highestScore || 0;
//     }

//     await setDoc(userRef, {
//       highestScore: newScore,
//       username,
//       userId: user.uid,
//     });

//     setCurrentScore(newScore);
//   };

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
//       }, 900);
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
//       }, 900);
//     }
//   };

//   const handleRestart = () => {
//     setLives(levelLives[selectedLevel]);
//     setTimeLeft(levelTimes[selectedLevel]);
//     setIncorrectAnswers(0);
//     setCurrentScore(0);
//     fetchImage();
//   };

//   return (
//     <div
//       className="flex flex-col items-center justify-start w-screen h-screen p-6"
//       style={{
//         backgroundImage: `url(${GamePageBg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         width: "100vw",
//         height: "100vh",
//         position: "fixed",
//       }}
//     >
//       {/* HEADER */}
//       <div className="bg-yellow-500 text-white px-8 py-4 rounded-xl shadow-xl mb-8">
//         <h2 className="text-6xl font-extrabold capitalize drop-shadow-lg">
//           {selectedLevel} Level
//         </h2>
//       </div>

//       {/* GAME BOX */}
//       <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl w-[850px] max-w-[95%] border-4 border-yellow-400">
//         <div className="flex justify-between mb-8 text-2xl font-bold">
//           <div className="bg-green-200 px-4 py-2 rounded-lg shadow">
//             Lives: {lives > 0 ? "❤️".repeat(lives) : "💀 Game Over"}
//           </div>

//           <div className="bg-yellow-200 px-4 py-2 rounded-lg shadow">
//             Time: {timeLeft}s
//           </div>

//           <div className="bg-blue-200 px-4 py-2 rounded-lg shadow">
//             Score: {currentScore}
//           </div>
//         </div>

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

//         <div className="text-center">
//           <button
//             onClick={handleRestart}
//             className="bg-green-600 text-white text-2xl px-8 py-4 rounded-xl shadow-lg hover:bg-green-800"
//           >
//             🔄 Restart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GamePage;
