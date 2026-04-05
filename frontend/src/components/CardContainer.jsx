import React from "react";
import gvkLogo from "../assets/gvk-logo.png";
import "./LoginPage.css";

function CardContainer({ children }) {
  return (
    <div className="login-page">
      <div className="login-grid card-shell-single">
        <div className="login-container card-shell">
          <div className="card-shell-brand">
            <img src={gvkLogo} alt="GVK Logo" className="logo" />
            <div>
              <div className="eyebrow">GVK Workflow</div>
              <h2>Structured candidate intake</h2>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default CardContainer;
