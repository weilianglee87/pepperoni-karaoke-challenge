import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSongFinished, setIsSongFinished] = useState(false);
  const navigate = useNavigate();

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setIsSongFinished(true);
  };

  const handleReadyClick = () => {
    navigate("/name");
  };

  return (
    <div className='landing-page'>
      <div className='content'>
        <h1>PEPPERONI-RONI Karaoke Challenge</h1>
        <div className='buttons-container'>
          <div className='button-section instructions'>
            <p>Listen to the song first before you start.</p>
            <audio
              ref={audioRef}
              src='/song.mp3'
              className='audio-player'
              onEnded={handleAudioEnded}
            />
            <button onClick={playAudio} className='listen-button'>
              Listen to Song
            </button>
          </div>
          <div className='button-section start-challenge'>
            <p>Then, click "I'm ready!" to begin the challenge!</p>
            <button
              onClick={handleReadyClick}
              className={`ready-button ${isSongFinished ? "ready" : ""}`}
              disabled={!isSongFinished}
            >
              I'm Ready!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
