import React from "react";
import { getCandidateValue, primaryCandidateKey } from "./candidateFields";

const NAME_KEY = primaryCandidateKey("name");
const ROLE_KEY = primaryCandidateKey("role");
const PHONE_SUMMARY_KEY = primaryCandidateKey("phoneSummary");
const PHONE_DATE_KEY = primaryCandidateKey("phoneDate");

function JobRoleStep({ children, candidate, setCandidate }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCandidate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="candidate-details-step">
      <div className="form-group">
        <label>
          Full Name
          <input
            type="text"
            name={NAME_KEY}
            className="form-input"
            value={getCandidateValue(candidate, "name") || ""}
            onChange={handleChange}
          />
        </label>
        <fieldset>
          <div className="radio">
            <label>
              Technician
              <input
                type="radio"
                name={ROLE_KEY}
                value="×˜×›× ××™"
                checked={getCandidateValue(candidate, "role") === "×˜×›× ××™"}
                onChange={handleChange}
              />
            </label>
            <label>
              Other
              <input
                type="radio"
                name={ROLE_KEY}
                value="××—×¨"
                checked={getCandidateValue(candidate, "role") === "××—×¨"}
                onChange={handleChange}
              />
            </label>
          </div>
        </fieldset>
        <label>
          Phone Screening Summary
          <textarea
            name={PHONE_SUMMARY_KEY}
            value={getCandidateValue(candidate, "phoneSummary") || ""}
            onChange={handleChange}
            className="form-textarea"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Phone Screening Date
          <input
            type="date"
            name={PHONE_DATE_KEY}
            value={getCandidateValue(candidate, "phoneDate") || ""}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        {children}
      </div>
    </div>
  );
}

export default JobRoleStep;
