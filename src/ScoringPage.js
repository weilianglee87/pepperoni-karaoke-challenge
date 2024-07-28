import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ScoringPage.css";

const ScoringPage = () => {
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const location = useLocation();
  const { playerName } = location.state || { playerName: "Player" };
  const navigate = useNavigate();

  useEffect(() => {
    const initialMessageTimer = setTimeout(() => {
      setShowCountdown(true);
    }, 3000); // Show the initial message for 3 seconds

    return () => clearTimeout(initialMessageTimer);
  }, []);

  useEffect(() => {
    if (showCountdown) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(countdownInterval);
            setShouldNavigate(true); // Trigger navigation
          }
          return prevCountdown - 1;
        });
      }, 1000); // Decrement the countdown every second
    }
  }, [showCountdown]);

  useEffect(() => {
    if (shouldNavigate) {
      navigate("/singing", { state: { playerName } });
    }
  }, [shouldNavigate, navigate, playerName]);

  return (
    <div className='scoring-page'>
      <div className='pepperoni'>
        {!showCountdown ? (
          <p>
            You’ll be scored based on how accurately you sing the lyrics. Good
            luck!
          </p>
        ) : (
          <p>{countdown > 0 ? countdown : "Start Singing!"}</p>
        )}
      </div>
    </div>
  );
};

export default ScoringPage;
