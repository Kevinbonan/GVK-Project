import React from "react";

function GradeAndExperienceStep({ children, candidate, setCandidate }) {
  const maxGrade = 5;
  const listOfGrades = Array.from(
    { length: maxGrade },
    (value, index) => index + 1
  );

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
          Grade
          <select
            name="×¦×™×•×Ÿ"
            value={candidate.×¦×™×•×Ÿ}
            onChange={handleChange}
            className="form-input"
          >
            <option value={0}>Select grade</option>
            {listOfGrades.map((item, index) => (
              <option key={index} value={item}>
                Grade {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Field Experience
          <textarea
            name="× ×™×¡×™×•×Ÿ ×‘×©×˜×—"
            value={candidate["× ×™×¡×™×•×Ÿ ×‘×©×˜×—"]}
            onChange={handleChange}
            className="form-textarea"
          />
        </label>
        {children}
      </div>
    </div>
  );
}

export default GradeAndExperienceStep;
