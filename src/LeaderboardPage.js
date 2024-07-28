import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardPage.css";

const LeaderboardPage = ({ leaderboard }) => {
  const navigate = useNavigate();

  return (
    <div className='leaderboard-page'>
      <div className='leaderboard-container'>
        <h2>LEADERBOARD</h2>
        <ul>
          {leaderboard.slice(0, 5).map((player, index) => (
            <li key={index}>
              {player.name}: {player.score} POINTS
            </li>
          ))}
        </ul>
      </div>
      <div className='buttons'>
        <button onClick={() => navigate("/")} className='home-button'>
          Home
        </button>
        <button
          onClick={() => navigate("/singing")}
          className='play-again-button'
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPage;
