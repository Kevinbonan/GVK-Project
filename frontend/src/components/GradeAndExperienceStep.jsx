import React from "react";
import { getCandidateValue, primaryCandidateKey } from "./candidateFields";

const GRADE_KEY = primaryCandidateKey("grade");
const FIELD_EXPERIENCE_KEY = primaryCandidateKey("fieldExperience");

function GradeAndExperienceStep({ children, candidate, setCandidate }) {
  const maxGrade = 5;
  const listOfGrades = Array.from({ length: maxGrade }, (value, index) => index + 1);

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
            name={GRADE_KEY}
            value={getCandidateValue(candidate, "grade") || 0}
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
            name={FIELD_EXPERIENCE_KEY}
            value={getCandidateValue(candidate, "fieldExperience") || ""}
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
