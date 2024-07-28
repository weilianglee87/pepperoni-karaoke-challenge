import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { debounce } from "lodash";
import "./SingingPage.css";

// Updated lyrics with timestamps and scores
const lyrics = [
  { time: 7, text: "pepperoni", score: 10 },
  { time: 8, text: "roni", score: 10 },
  { time: 11, text: "pepperoni", score: 10 },
  { time: 12, text: "roni", score: 10 },
  { time: 13, text: "oh", score: 10 },
  { time: 14, text: "domino’s", score: 10 },
  { time: 15, text: "give", score: 10 },
  { time: 15.5, text: "me", score: 10 },
  { time: 16, text: "more", score: 10 },
  { time: 23, text: "one", score: 10 },
  { time: 23.5, text: "hundred", score: 10 },
  { time: 24, text: "fifty", score: 10 },
  { time: 24.5, text: "percent", score: 10 },
  { time: 26, text: "more", score: 10 },
  { time: 26.5, text: "pepperoni", score: 10 },
  { time: 27, text: "roni", score: 10 },
  { time: 28, text: "with", score: 10 },
  { time: 28.5, text: "a", score: 10 },
  { time: 29, text: "mozzarella", score: 10 },
  { time: 30, text: "twisty", score: 10 },
  { time: 31, text: "crust", score: 10 },
];

const numberToWords = (num) => {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (num < 20) return a[num];
  if (num < 100)
    return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
  if (num < 1000)
    return (
      a[Math.floor(num / 100)] +
      " hundred" +
      (num % 100 ? " " + numberToWords(num % 100) : "")
    );
  return num;
};

const replaceNumbersWithWords = (text) => {
  return text.replace(/\d+/g, (match) => numberToWords(parseInt(match)));
};

const SingingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerName } = location.state || { playerName: "Player" };
  const [score, setScore] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [lyricsArray, setLyricsArray] = useState(lyrics);
  const audioRef = useRef(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isPlaying, setIsPlaying] = useState(false);
  const scoredWordsRef = useRef(new Set());

  const processTranscript = useCallback(
    debounce((transcript) => {
      const currentWord = lyricsArray[currentWordIndex];
      const transformedTranscript = replaceNumbersWithWords(
        transcript.toLowerCase()
      );
      if (
        currentWord &&
        transformedTranscript.includes(currentWord.text.toLowerCase()) &&
        !scoredWordsRef.current.has(currentWord.text)
      ) {
        console.log("Matched word:", currentWord.text); // Log the matched word
        setScore((prevScore) => prevScore + currentWord.score);
        scoredWordsRef.current.add(currentWord.text);
        resetTranscript();
      }
    }, 500), // Increased debounce delay
    [currentWordIndex, lyricsArray, resetTranscript]
  );

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const playAudio = () => {
        const audioElement = audioRef.current;
        audioElement.play();
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        });
        const intervalId = setInterval(() => {
          const currentTime = audioElement.currentTime;
          const newWordIndex = lyricsArray.findIndex(
            (word, index) =>
              currentTime >= word.time &&
              currentTime < (lyricsArray[index + 1]?.time || Infinity)
          );
          if (newWordIndex !== -1 && newWordIndex !== currentWordIndex) {
            setCurrentWordIndex(newWordIndex);
          }
        }, 100);

        audioElement.onended = () => {
          clearInterval(intervalId);
          SpeechRecognition.stopListening();
          navigate("/score", { state: { score, playerName } });
        };
      };

      playAudio();
    }
  }, [isPlaying, navigate, playerName, currentWordIndex, lyricsArray]);

  useEffect(() => {
    if (transcript) {
      processTranscript(transcript);
    }
  }, [transcript, processTranscript]);

  const startGame = () => {
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.pause();
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
      <div className='score-display'>Your Score: {score}</div>
      <div className='content'>
        <div className='lyrics-container'>
          {lyricsArray.map((word, index) => (
            <span
              key={index}
              className={`word ${index <= currentWordIndex ? "highlight" : ""}`}
            >
              {word.text}{" "}
            </span>
          ))}
        </div>
        <audio
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
