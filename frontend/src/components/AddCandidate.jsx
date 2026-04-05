import React, { useState } from "react";
import Navbar from "./Navbar";
import ProgressBar from "./ProgressBar";
import JobRoleStep from "./JobRoleStep";
import CandidateDetailsStep from "./CandidateDetailsStep";
import GradeAndExperienceStep from "./GradeAndExperienceStep";
import AdditionalInfoStep from "./AdditionalInfoStep";
import "./AddCandidate.css";
import CardContainer from "./CardContainer";
import ButtonGroup from "./ButtonGroup";
import CandidateSummary from "./CandidateSummary";
import axios from "axios";
import { BASE_URL } from "../App";
import { useNavigate } from "react-router-dom";
import { buildEmptyCandidate } from "./candidateFields";

function AddCandidate() {
  const today = new Date().toISOString().split("T")[0];
  const [isSummary, setIsSummary] = useState(false);
  const [candidate, setCandidate] = useState(buildEmptyCandidate(today));
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();

  const handleNext = () => {
    !isSummary && step !== totalSteps
      ? setStep((prevStep) => prevStep + 1)
      : setIsSummary(true);
  };

  const handlePrevious = () => {
    isSummary ? setIsSummary(false) : setStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <JobRoleStep
            candidate={candidate}
            setCandidate={setCandidate}
            children={
              <ButtonGroup
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                step={step}
                isSummary={isSummary}
              />
            }
          />
        );
      case 2:
        return (
          <CandidateDetailsStep
            candidate={candidate}
            setCandidate={setCandidate}
            children={
              <ButtonGroup
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                step={step}
                isSummary={isSummary}
              />
            }
          />
        );
      case 3:
        return (
          <GradeAndExperienceStep
            candidate={candidate}
            setCandidate={setCandidate}
            children={
              <ButtonGroup
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                step={step}
                isSummary={isSummary}
              />
            }
          />
        );
      case 4:
        return (
          <AdditionalInfoStep
            candidate={candidate}
            setCandidate={setCandidate}
            children={
              <ButtonGroup
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                step={step}
                isSummary={isSummary}
              />
            }
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        BASE_URL + "/insert_candidate",
        { candidate },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/allCandidates");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <CardContainer>
        <div className="candidate-flow-header">
          <div>
            <div className="eyebrow">Candidate Intake</div>
            <h1>{isSummary ? "Review candidate profile" : "Add a new candidate"}</h1>
            <p>
              A guided workflow for collecting technical, operational and
              interview information in a clear and consistent format.
            </p>
          </div>
          <div className="status-pill">
            Step {isSummary ? totalSteps : step} / {totalSteps}
          </div>
        </div>
        {!isSummary && <ProgressBar step={step} totalSteps={totalSteps} />}
        {isSummary ? (
          <CandidateSummary
            candidate={candidate}
            handleSubmit={handleSubmit}
            children={
              <ButtonGroup
                handlePrevious={handlePrevious}
                step={step}
                isSummary={isSummary}
              />
            }
          />
        ) : (
          renderStep()
        )}
      </CardContainer>
    </>
  );
}

export default AddCandidate;
