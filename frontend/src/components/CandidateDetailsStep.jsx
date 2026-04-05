import React from "react";
import { getCandidateValue, primaryCandidateKey } from "./candidateFields";

const INTERVIEW_SUMMARY_KEY = primaryCandidateKey("interviewSummary");
const YEARS_EXPERIENCE_KEY = primaryCandidateKey("yearsExperience");
const SECURITY_KEY = primaryCandidateKey("securityClearance");
const SAFETY_KEY = primaryCandidateKey("safety");
const FORM_101_KEY = primaryCandidateKey("form101");
const INTERVIEW_DATE_KEY = primaryCandidateKey("interviewDate");

function CandidateDetailsStep({ children, candidate, setCandidate }) {
  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setCandidate((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="candidate-details-step">
      <div className="form-group">
        <label>
          Interview Summary
          <textarea
            name={INTERVIEW_SUMMARY_KEY}
            value={getCandidateValue(candidate, "interviewSummary") || ""}
            onChange={handleChange}
            className="form-textarea"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Years of Experience
          <input
            type="number"
            name={YEARS_EXPERIENCE_KEY}
            value={getCandidateValue(candidate, "yearsExperience") || 0}
            onChange={handleChange}
            className="form-input"
          />
        </label>
      </div>
      <div className="form-group checkbox-group">
        <label>
          Security Clearance
          <input
            type="checkbox"
            name={SECURITY_KEY}
            onChange={handleChange}
            className="form-checkbox"
            checked={Boolean(getCandidateValue(candidate, "securityClearance"))}
          />
        </label>
        <label>
          Safety Certified
          <input
            type="checkbox"
            name={SAFETY_KEY}
            onChange={handleChange}
            className="form-checkbox"
            checked={Boolean(getCandidateValue(candidate, "safety"))}
          />
        </label>
        <label>
          101
          <input
            type="checkbox"
            name={FORM_101_KEY}
            onChange={handleChange}
            className="form-checkbox"
            checked={Boolean(getCandidateValue(candidate, "form101"))}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Interview Date
          <input
            type="date"
            name={INTERVIEW_DATE_KEY}
            value={getCandidateValue(candidate, "interviewDate") || ""}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        {children}
      </div>
    </div>
  );
}

export default CandidateDetailsStep;
