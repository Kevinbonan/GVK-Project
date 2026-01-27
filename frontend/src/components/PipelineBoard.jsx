import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { BASE_URL } from "../App";
import "./PipelineBoard.css";

const STATUSES = [
  "Applied",
  "HR Interview",
  "Technical Interview",
  "Offer",
  "Hired",
  "Rejected",
];

function PipelineBoard() {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    const response = await axios.get(`${BASE_URL}/candidates`, {
      withCredentials: true,
    });
    setCandidates(response.data);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const groupedCandidates = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = candidates.filter(
        (candidate) => (candidate.status || "Applied") === status
      );
      return acc;
    }, {});
  }, [candidates]);

  const moveToNextStatus = async (candidate) => {
    const currentIndex = STATUSES.indexOf(candidate.status || "Applied");
    const nextStatus = STATUSES[currentIndex + 1];
    if (!nextStatus) {
      return;
    }
    await axios.put(
      `${BASE_URL}/candidates/${candidate._id}/status`,
      { status: nextStatus },
      { withCredentials: true }
    );
    fetchCandidates();
  };

  return (
    <div className="pipeline-page">
      <Navbar />
      <div className="pipeline-board">
        {STATUSES.map((status) => (
          <div key={status} className="pipeline-column">
            <h3>{status}</h3>
            {groupedCandidates[status]?.length ? (
              groupedCandidates[status].map((candidate) => (
                <div className="pipeline-card" key={candidate._id}>
                  <Link to={`/candidates/${candidate._id}`}>
                    <strong>{candidate["שם"] || candidate.fullName}</strong>
                  </Link>
                  <p>{candidate["תפקיד"] || candidate.jobTitle}</p>
                  <button
                    type="button"
                    onClick={() => moveToNextStatus(candidate)}
                    disabled={status === "Hired" || status === "Rejected"}
                  >
                    Next
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-column">No candidates</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PipelineBoard;
