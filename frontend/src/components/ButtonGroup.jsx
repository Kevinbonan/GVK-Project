import React from "react";
import "./ButtonGroup.css";

function ButtonGroup({
  children,
  handleNext,
  handlePrevious,
  step,
  isSummary,
}) {
  return (
    <div className="button-group">
      {step > 1 && (
        <button name="back" onClick={handlePrevious}>
          הקודם
        </button>
      )}
      {step < 5 && !isSummary ? (
        <button name="next" onClick={handleNext}>
          הבא
        </button>
      ) : (
        <button name="add" type="submit">
          הוסף
        </button>
      )}

      {children}
    </div>
  );
}

export default ButtonGroup;
