import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import { db, auth } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import GamePageBg from "../assets/LoginPage.png";
import { useNavigate } from "react-router-dom";

import correctSound from "../assets/sounds/correct-83487.mp3";
import wrongSound from "../assets/sounds/buzzer-or-wrong-answer-20582.mp3";
import gameOverSound from "../assets/sounds/game-over-deep-male-voice-clip-352695.mp3";
import clickSound from "../assets/sounds/computer-mouse-click-351398.mp3";
import backgroundMusic from "../assets/sounds/game-music-loop-3-144252.mp3";
import firebase from "firebase/compat/app";

type LevelType = "Easy" | "Medium" | "Hard";

interface GamePageProps {
  selectedLevel: LevelType;
}

// Sound Effects (UNCHANGED)
const correctAudio = new Audio(correctSound);
const wrongAudio = new Audio(wrongSound);
const gameOverAudio = new Audio(gameOverSound);
const clickAudio = new Audio(clickSound);

function GamePage({ selectedLevel }: GamePageProps) {
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

  /*Use States use variable*/
  const [timeLeft, setTimeLeft] = useState(levelTimes[selectedLevel]);
  const [lives, setLives] = useState(levelLives[selectedLevel]);
  const [imageData, setImageData] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const [soundOn, setSoundOn] = useState<boolean>(
    localStorage.getItem("sound") === "off" ? false : true
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  /* Background Music*/
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    backgroundAudioRef.current = new Audio(backgroundMusic);
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.6;

    if (soundOn) {
      backgroundAudioRef.current
        .play()
        .catch(() => console.warn("Autoplay blocked"));
    }

    return () => {
      backgroundAudioRef.current?.pause();
      backgroundAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!backgroundAudioRef.current) return;

    if (soundOn) {
      backgroundAudioRef.current.play();
    } else {
      backgroundAudioRef.current.pause();
    }
  }, [soundOn]);


 /* save score to firebase*/

 const saveScore = async (scoreToAdd: number) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const username = user.displayName || "Player";
    const userId = user.uid;

    // OLD COLLECTION (username-based) — UNCHANGED
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

    // NEW COLLECTION (userId-based)
    const userIdRef = doc(db, "userScores", userId);
    const userIdDoc = await getDoc(userIdRef);

    let newUserIdScore = scoreToAdd;
    if (userIdDoc.exists()) {
      newUserIdScore += userIdDoc.data().highestScore || 0;
    }

    await setDoc(userIdRef, {
      highestScore: newUserIdScore,
      username,
      userId,
    });

    setCurrentScore(newScore);
  } catch (error) {
    console.error("Error saving score:", error);
  }
};

  // FETCH PUZZLE(Banana API)
  const fetchImage = async () => {
    try {
      const res = await fetch("https://marcconrad.com/uob/banana/api.php");
      const data = await res.json();
      setImageData(data);
      setTimeLeft(levelTimes[selectedLevel]);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  //TIMER
  useEffect(() => {
    if (lives === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;

        if (lives > 1) {
          setLives((l) => l - 1);
          fetchImage();
          return levelTimes[selectedLevel];
        } else {
          setLives(0);
          saveScore(currentScore);
          if (soundOn) gameOverAudio.play();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [lives, soundOn]);

  //  ANSWER SELECTION
  const handleAnswerSelection = (number: number) => {
    if (!imageData || lives === 0) return;

    setSelectedAnswer(number);

    if (number === imageData.solution) {
      setIsCorrect(true);
      if (soundOn) correctAudio.play();

      const scoreBonus =
        selectedLevel === "Easy"
          ? 10
          : selectedLevel === "Medium"
          ? 20
          : 35;

      const newScore = currentScore + scoreBonus;
      setCurrentScore(newScore);
      saveScore(scoreBonus);

      setTimeout(() => {
        fetchImage();
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1000);
    } else {
      setIsCorrect(false);
      setIncorrectAnswers((prev) => prev + 1);
      if (soundOn) wrongAudio.play();

      if (lives > 1) setLives((prev) => prev - 1);
      else setLives(0);

      setTimeout(() => {
        fetchImage();
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  // RESTART
  const handleRestart = () => {
    setLives(levelLives[selectedLevel]);
    setTimeLeft(levelTimes[selectedLevel]);
    setIncorrectAnswers(0);
    setCurrentScore(0);
    fetchImage();
    if (soundOn) clickAudio.play();
  };

  return (
    <div
      className="min-h-screen bg-cover flex flex-col items-center justify-start p-6"
      style={{ backgroundImage: `url(${GamePageBg})`, height: "100vh" }}
    >
      <div className="flex justify-between w-full max-w-4xl mb-6 text-xl font-bold text-white">

{/*       
        <div
          style={{
            marginLeft: "100px",
            position: "relative",
            top: "200px",
            left: "200px",
            width: "700px",
            height: "500px",
            backgroundColor: "rgba(37, 86, 86, 0.8)",
            borderRadius: "25px",
            padding: "30px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        > */}


<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // full screen height
  }}
>
  <div
    style={{
      width: "700px",
      height: "500px",
      backgroundColor: "rgba(37, 86, 86, 0.8)",
      borderRadius: "25px",
      padding: "30px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
       position: "relative",
          marginLeft: "20px",
          marginRight: "360px",
          marginBottom: "70px",
    }}
  >
    {/* Your content here */}
 


          <div className="bg-green-600 px-4 py-2 rounded-lg shadow">
            Lives: {lives > 0 ? "❤️".repeat(lives) : "💀 Game Over"}
          </div>

          <div className="bg-yellow-500 px-4 py-2 rounded-lg shadow">
            Time: {timeLeft}s
          </div>

          <div className="bg-blue-600 px-4 py-2 rounded-lg shadow">
            Score: {currentScore}
          </div>

          <div
            style={{
              marginLeft: "100px",
              position: "absolute",
              top: "30px",
              left: "150px",
              fontSize: "30px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Level: {selectedLevel}
          </div>

          <div
            style={{
             // marginLeft: "100px",
            //  position: "absolute",
           //   top: "30px",
             // left: "450px",
             position: "static",
             marginLeft: "500px",
              top: "30px",
              right: "px",
              fontSize: "15x",
              fontWeight: "bold",
              color: "white",
            }}
          >
            <button
              onClick={handleRestart}
              className="bg-green-600 text-white px-6 py-2 rounded-lg mr-4"
            >
              Restart
            </button>
            <button
              onClick={() => {
                if (soundOn) clickAudio.play();
                navigate("/mainmenu");
              }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Exit
            </button>
          </div>

          {imageData && (
            <img
              src={imageData.question}
              alt="Puzzle"
              className="w-[350px] h-auto rounded-xl shadow-xl mb-6"
            />
          )}

          {lives > 0 && (
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAnswerSelection(num)}
                  className="w-14 h-14 bg-white text-black text-xl rounded-lg shadow hover:bg-green-400 transition"
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {isCorrect === true && (
            <p className="text-green-600 text-2xl font-bold">Correct!</p>
          )}
          {isCorrect === false && (
            <p className="text-red-600 text-2xl font-bold">Wrong!</p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
