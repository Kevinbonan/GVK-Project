import React from "react";

function CandidateDetailsStep({ children, candidate, setCandidate }) {
  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    type === "checkbox"
      ? setCandidate((prev) => ({
          ...prev,
          [name]: checked,
        }))
      : setCandidate((prev) => ({
          ...prev,
          [name]: value,
        }));
  };

  return (
    <div className="candidate-details-step">
      <div className="form-group">
        <label>
          Interview Summary
          <textarea
            name="×¡×™×›×•× ×¨×™××™×•×Ÿ"
            value={candidate["×¡×™×›×•× ×¨×™××™×•×Ÿ"]}
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
            name="×©× ×•×ª × ×™×¡×™×•×Ÿ"
            value={candidate["×©× ×•×ª × ×™×¡×™×•×Ÿ"]}
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
            name="×¡×™×•×•×’ ×‘×™×˜×—×•× ×™"
            onChange={handleChange}
            className="form-checkbox"
            value={candidate["×¡×™×•×•×’ ×‘×™×˜×—×•× ×™"]}
            checked={candidate["×¡×™×•×•×’ ×‘×™×˜×—×•× ×™"] ? true : false}
          />
        </label>
        <label>
          Safety Certified
          <input
            type="checkbox"
            name="×‘×˜×™×—×•×ª"
            onChange={handleChange}
            className="form-checkbox"
            value={candidate.×‘×˜×™×—×•×ª}
            checked={candidate.×‘×˜×™×—×•×ª ? true : false}
          />
        </label>
        <label>
          101
          <input
            type="checkbox"
            name="'101'"
            onChange={handleChange}
            className="form-checkbox"
            value={candidate["'101'"]}
            checked={candidate["'101'"] ? true : false}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Interview Date
          <input
            type="date"
            name="×ª××¨×™×š ×¨×™××™×•×Ÿ"
            value={candidate["×ª××¨×™×š ×¨×™××™×•×Ÿ"]}
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
