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
          סיכום ראיון:
          <textarea
            name="סיכום ריאיון"
            value={candidate["סיכום ריאיון"]}
            onChange={handleChange}
            className="form-textarea"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          שנות ניסיון:
          <input
            type="number"
            name="שנות ניסיון"
            value={candidate["שנות ניסיון"]}
            onChange={handleChange}
            className="form-input"
          />
        </label>
      </div>
      <div className="form-group checkbox-group">
        <label>
          סיווג ביטחוני:
          <input
            type="checkbox"
            name="סיווג ביטחוני"
            onChange={handleChange}
            className="form-checkbox"
            value={candidate["סיווג ביטחוני"]}
            checked={candidate["סיווג ביטחוני"] ? true : false}
          />
        </label>
        <label>
          בטיחות:
          <input
            type="checkbox"
            name="בטיחות"
            onChange={handleChange}
            className="form-checkbox"
            value={candidate.בטיחות}
            checked={candidate.בטיחות ? true : false}
          />
        </label>
        <label>
          101:
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
          תאריך ראיון:
          <input
            type="date"
            name="תאריך ריאיון"
            value={candidate["תאריך ריאיון"]}
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
