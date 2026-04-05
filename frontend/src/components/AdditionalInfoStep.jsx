import React from "react";
import { getCandidateValue, primaryCandidateKey } from "./candidateFields";

const ADDITIONAL_INFO_KEY = primaryCandidateKey("additionalInfo");

function AdditionalInfoStep({ children, candidate, setCandidate }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCandidate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="additional-info-step">
      <label>
        Additional Information
        <textarea
          name={ADDITIONAL_INFO_KEY}
          value={getCandidateValue(candidate, "additionalInfo") || ""}
          onChange={handleChange}
          className="form-textarea"
        />
      </label>
      {children}
    </div>
  );
}

export default AdditionalInfoStep;
