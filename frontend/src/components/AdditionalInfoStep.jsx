import React from "react";

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
        מידע נוסף:
        <textarea
          name="מידע נוסף"
          value={candidate["מידע נוסף"]}
          onChange={handleChange}
          className="form-textarea"
        />
      </label>
      {children}
    </div>
  );
}

export default AdditionalInfoStep;
