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
          שם:
          <input
            type="text"
            name="שם"
            className="form-input"
            value={candidate.שם}
            onChange={handleChange}
          />
        </label>
        <fieldset>
          <div className="radio">
            <label>
              טכנאי
              <input
                type="radio"
                name="תפקיד"
                value="טכנאי"
                checked={candidate.תפקיד === "טכנאי"}
                onChange={handleChange}
              ></input>
            </label>
            <label>
              אחר
              <input
                type="radio"
                name="תפקיד"
                value="אחר"
                checked={candidate.תפקיד === "אחר"}
                onChange={handleChange}
              ></input>
            </label>
          </div>
        </fieldset>
        <label>
          סיכום שיחת טלפון:
          <textarea
            name="סיכום שיחת טלפון"
            value={candidate["סיכום שיחת טלפון"]}
            onChange={handleChange}
            className="form-textarea"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          תאריך שיחת טלפון:
          <input
            type="date"
            name="תאריך שיחת טלפון"
            value={candidate["תאריך שיחת טלפון"]}
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
