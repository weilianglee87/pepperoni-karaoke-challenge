import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const audioRef = useRef(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const playAudio = () => {
        audioRef.current.audioEl.current.play();
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        });
        const intervalId = setInterval(() => {
          const currentTime = audioRef.current.audioEl.current.currentTime;
          const newWordIndex = lyrics.findIndex(
            (word, index) =>
              currentTime >= word.time &&
              currentTime < (lyrics[index + 1]?.time || Infinity)
          );
          if (newWordIndex !== -1 && newWordIndex !== currentWordIndex) {
            setCurrentWordIndex(newWordIndex);
          }
        }, 100);

        audioRef.current.audioEl.current.onended = () => {
          clearInterval(intervalId);
          SpeechRecognition.stopListening();
          navigate("/score", { state: { score, playerName } });
        };
      };

      playAudio();
    }
  }, [isPlaying, navigate, playerName, currentWordIndex]);

  useEffect(() => {
    const currentWord = lyrics[currentWordIndex];
    if (transcript.toLowerCase().includes(currentWord.text.toLowerCase())) {
      console.log("Matched word:", currentWord.text); // Log the matched word
      setScore((prevScore) => prevScore + currentWord.score);
      resetTranscript();
    }
  }, [transcript, currentWordIndex, resetTranscript]);

  const startGame = () => {
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.audioEl.current.pause();
      SpeechRecognition.stopListening();
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
        <ReactAudioPlayer
          ref={audioRef}
          src='/song.mp3'
          className='audio-player'
          onError={(e) => console.error("Error loading audio:", e)}
        />
        <div className='buttons'>
          <button onClick={startGame} className='start-button'>
            Start Game
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
