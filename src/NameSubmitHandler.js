import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NameFillPage from "./NameFillPage";

const NameSubmitHandler = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleNameSubmit = (submittedName) => {
    setName(submittedName);
    navigate("/"); // Navigate back to the landing page
  };

  return <NameFillPage onNameSubmit={handleNameSubmit} />;
};

export default NameSubmitHandler;
