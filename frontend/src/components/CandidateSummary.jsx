import React from "react";
import "./CandidateSummary.css";

function CandidateSummary({ candidate, handleSubmit, children }) {
  return (
    <form onSubmit={handleSubmit} className="candidate-summary-form">
      <ul className="candidate-summary-list">
        {Object.entries(candidate).map(([key, value]) => (
          <li className="candidate-summary-item" key={key}>
            <label className="candidate-summary-label">{key}:</label>
            <span className="candidate-summary-value">{value.toString()}</span>
          </li>
        ))}
      </ul>
      {children}
    </form>
  );
}

export default CandidateSummary;
