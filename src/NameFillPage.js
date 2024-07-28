import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NameFillPage.css";

const NameFillPage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (name.trim()) {
      navigate("/scoring", { state: { playerName: name } });
    }
  };

  return (
    <div className='name-fill-page'>
      <div className='pepperoni'>
        <input
          type='text'
          placeholder='Enter your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='name-input'
        />
        <button
          onClick={handleSubmit}
          className='done-button'
          disabled={!name.trim()}
        >
          Done!
        </button>
      </div>
    </div>
  );
};

export default NameFillPage;
