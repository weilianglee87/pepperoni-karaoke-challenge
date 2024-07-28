import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import NameFillPage from "./NameFillPage";
import ScoringPage from "./ScoringPage";
import SingingPage from "./SingingPage";
import ScorePage from "./ScorePage";
import LeaderboardPage from "./LeaderboardPage";

const App = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  const handleNameSubmit = (submittedName) => {
    setName(submittedName);
    navigate("/scoring");
  };

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route
          path='/name'
          element={<NameFillPage onNameSubmit={handleNameSubmit} />}
        />
        <Route path='/scoring' element={<ScoringPage />} />
        <Route path='/singing' element={<SingingPage />} />
        <Route
          path='/score'
          element={
            <ScorePage
              leaderboard={leaderboard}
              setLeaderboard={setLeaderboard}
            />
          }
        />
        <Route
          path='/leaderboard'
          element={<LeaderboardPage leaderboard={leaderboard} />}
        />
      </Routes>
    </div>
  );
};

export default App;
