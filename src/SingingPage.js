import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SingingPage.css";

// Updated lyrics with timestamps and scores
const lyrics = [
  { time: 7, text: "pepperoni", score: 4 },
  { time: 8, text: "roni", score: 4 },
  { time: 11, text: "pepperoni", score: 4 },
  { time: 12, text: "roni", score: 4 },
  { time: 13, text: "oh", score: 4 },
  { time: 14, text: "domino’s", score: 4 },
  { time: 15, text: "give me more", score: 4 },
  { time: 16, text: "pepperoni", score: 4 },
  { time: 23, text: "one hundred", score: 4 },
  { time: 24, text: "fifty percent", score: 4 },
  { time: 26, text: "more pepperoni", score: 4 },
  { time: 27, text: "roni", score: 4 },
  { time: 28, text: "with a mozzarella", score: 4 },
  { time: 30, text: "twisty", score: 4 },
  { time: 31, text: "crust", score: 4 },
];

const SingingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerName } = location.state || { playerName: "Player" };
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const audioRef = useRef(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        const currentWord = lyrics[currentWordIndex];
        console.log("Transcript:", transcript); // Log the transcript
        if (transcript.toLowerCase().includes(currentWord.text.toLowerCase())) {
          console.log("Matched word:", currentWord.text); // Log the matched word
          setScore((prevScore) => {
            const newScore = prevScore + currentWord.score;
            scoreRef.current = newScore; // Update the ref value
            console.log("Updated Score:", newScore); // Log the updated score
            return newScore;
          });
        }
      };

      setRecognition(recognitionInstance);
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  }, [currentWordIndex]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      recognition.start();
      const intervalId = setInterval(() => {
        const currentTime = audioRef.current.currentTime;
        const newWordIndex = lyrics.findIndex(
          (word, index) =>
            currentTime >= word.time &&
            currentTime < (lyrics[index + 1]?.time || Infinity)
        );
        if (newWordIndex !== -1 && newWordIndex !== currentWordIndex) {
          setCurrentWordIndex(newWordIndex);
        }
      }, 100);

      audioRef.current.onended = () => {
        clearInterval(intervalId);
        recognition.stop();
        console.log(
          "Navigating to Score Page with score:",
          scoreRef.current,
          "and playerName:",
          playerName
        );
        navigate("/score", { state: { score: scoreRef.current, playerName } });
      };
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      recognition.stop();
    }
  };

  const handleRestart = () => {
    window.location.reload(); // Simple way to restart the game
  };

  const handleQuit = () => {
    window.location.href = "/"; // Navigate to the landing page
  };

  return (
    <div className='singing-page'>
      <h2>Welcome, {playerName}</h2>
      <div className='score-display'>Your Score: {score}</div>
      <div className='content'>
        <img src='/path-to-your-gif.gif' alt='Pepperoni Gif' className='gif' />
        <div className='lyrics-container'>
          {lyrics.map((word, index) => (
            <span
              key={index}
              className={`word ${index <= currentWordIndex ? "highlight" : ""}`}
            >
              {word.text}{" "}
            </span>
          ))}
        </div>
        <audio ref={audioRef} src='/song.mp3' className='audio-player'></audio>
        <div className='buttons'>
          <button onClick={playAudio} className='listen-again-button'>
            Listen to Song Again
          </button>
          <button onClick={pauseAudio} className='pause-button'>
            Pause
          </button>
          <button onClick={handleRestart} className='restart-button'>
            Restart
          </button>
          <button onClick={handleQuit} className='quit-button'>
            Quit Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingingPage;
