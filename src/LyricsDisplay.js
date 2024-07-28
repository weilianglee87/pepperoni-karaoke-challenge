// src/components/LyricsDisplay.js
import React from "react";

const LyricsDisplay = ({ currentLyric }) => {
  return (
    <div className='lyrics-container'>
      <p className={currentLyric ? "highlight" : ""}>{currentLyric}</p>
    </div>
  );
};

export default LyricsDisplay;
