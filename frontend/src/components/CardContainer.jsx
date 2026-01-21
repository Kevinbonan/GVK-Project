import React from "react";
import gvkLogo from "../assets/gvk-logo.png";
import "./LoginPage.css";

function CardContainer({ children }) {
  return (
    <div className="login-page">
      <div className="login-container">
        <img src={gvkLogo} alt="GVK Logo" className="logo" />
        {children}
      </div>
    </div>
  );
}

export default CardContainer;
