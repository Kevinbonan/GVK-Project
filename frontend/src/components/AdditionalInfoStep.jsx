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
        Additional Information
        <textarea
          name="×ž×™×“×¢ × ×•×¡×£"
          value={candidate["×ž×™×“×¢ × ×•×¡×£"]}
          onChange={handleChange}
          className="form-textarea"
        />
      </label>
      {children}
    </div>
  );
}

export default AdditionalInfoStep;
