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

function AddCandidate() {
  const today = new Date().toISOString().split("T")[0];
  const [isSummary, setIsSummary] = useState(false);
  const [candidate, setCandidate] = useState({
    שם: "",
    תפקיד: "",
    "סיכום שיחת טלפון": "",
    "תאריך שיחת טלפון": today,
    "סיכום ריאיון": "",
    "שנות ניסיון": 0,
    "סיווג ביטחוני": false,
    בטיחות: false,
    "'101'": false,
    "תאריך ריאיון": today,
    ציון: 0,
    "ניסיון בשטח": "",
    "מידע נוסף": "",
  });

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

  const showSummaryPage = () => {
    return (
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
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        BASE_URL + "/insert_candidate",
        {
          candidate: candidate,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/allCandidates");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <CardContainer>
      <Navbar />
      {!isSummary && <ProgressBar step={step} totalSteps={totalSteps} />}
      {isSummary ? showSummaryPage() : renderStep()}
    </CardContainer>
  );
}

export default AddCandidate;
