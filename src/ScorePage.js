import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ScorePage.css";

const ScorePage = ({ leaderboard, setLeaderboard }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, playerName } = location.state || {
    score: "",
    playerName: "Player",
  };

  useEffect(() => {
    console.log("Received score:", score, "and playerName:", playerName);
    if (score > 0) {
      setLeaderboard((prevLeaderboard) => {
        const newLeaderboard = [
          ...prevLeaderboard,
          { name: playerName, score },
        ];
        return newLeaderboard.sort((a, b) => b.score - a.score).slice(0, 5);
      });
    }
  }, [score, playerName, setLeaderboard]);

  return (
    <div className='score-page'>
      <h1>Congratulations, {playerName}!</h1>
      <div className='score'>Your Score: {score}</div>
      <div className='buttons'>
        <button
          onClick={() => navigate("/leaderboard")}
          className='leaderboard-button'
        >
          Leaderboard
        </button>
        <button
          onClick={() => navigate("/singing", { state: { playerName } })}
          className='play-again-button'
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ScorePage;
