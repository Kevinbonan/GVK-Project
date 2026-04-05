import React from "react";

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
            name="×©×"
            className="form-input"
            value={candidate.×©×}
            onChange={handleChange}
          />
        </label>
        <fieldset>
          <div className="radio">
            <label>
              Technician
              <input
                type="radio"
                name="×ª×¤×§×™×“"
                value="×˜×›× ××™"
                checked={candidate.×ª×¤×§×™×“ === "×˜×›× ××™"}
                onChange={handleChange}
              />
            </label>
            <label>
              Other
              <input
                type="radio"
                name="×ª×¤×§×™×“"
                value="××—×¨"
                checked={candidate.×ª×¤×§×™×“ === "××—×¨"}
                onChange={handleChange}
              />
            </label>
          </div>
        </fieldset>
        <label>
          Phone Screening Summary
          <textarea
            name="×¡×™×›×•× ×©×™×—×ª ×˜×œ×¤×•×Ÿ"
            value={candidate["×¡×™×›×•× ×©×™×—×ª ×˜×œ×¤×•×Ÿ"]}
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
            name="×ª××¨×™×š ×©×™×—×ª ×˜×œ×¤×•×Ÿ"
            value={candidate["×ª××¨×™×š ×©×™×—×ª ×˜×œ×¤×•×Ÿ"]}
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
