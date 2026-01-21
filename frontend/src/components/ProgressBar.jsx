import React from "react";
import "./ProgressBar.css";

function ProgressBar(props) {
  const progressBarWidth = `${(props.step / props.totalSteps) * 100}%`;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: progressBarWidth }}>
        <div className="step-number">{props.step}</div>
      </div>
    </div>
  );
}

export default ProgressBar;
