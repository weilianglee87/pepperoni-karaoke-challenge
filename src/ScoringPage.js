import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ScoringPage.css";

const ScoringPage = () => {
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCountdown(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCountdown) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(interval);
            setTimeout(() => navigate("/singing"), 0); // Delay navigation
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
  }, [showCountdown, navigate]);

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
