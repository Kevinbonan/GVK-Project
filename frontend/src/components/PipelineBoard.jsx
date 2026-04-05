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
      <main className="page-shell pipeline-shell">
        <section className="page-header">
          <div>
            <div className="eyebrow">Recruitment Flow</div>
            <h1>Pipeline board</h1>
            <p>
              Monitor progression across every hiring stage with a clearer,
              higher-contrast kanban built for technical recruitment operations.
            </p>
          </div>
          <span className="status-pill">{candidates.length} active candidates</span>
        </section>

        <div className="pipeline-board">
          {STATUSES.map((status) => (
            <section key={status} className="pipeline-column">
              <div className="pipeline-column-header">
                <h3>{status}</h3>
                <span>{groupedCandidates[status]?.length || 0}</span>
              </div>
              {groupedCandidates[status]?.length ? (
                groupedCandidates[status].map((candidate) => (
                  <div className="pipeline-card" key={candidate._id}>
                    <div className="pipeline-card-top">
                      <span className="status-pill">{status}</span>
                    </div>
                    <Link to={`/candidates/${candidate._id}`}>
                      <strong>{candidate["×©×"] || candidate.fullName}</strong>
                    </Link>
                    <p>{candidate["×ª×¤×§×™×“"] || candidate.jobTitle}</p>
                    <button
                      type="button"
                      onClick={() => moveToNextStatus(candidate)}
                      disabled={status === "Hired" || status === "Rejected"}
                    >
                      Move Forward
                    </button>
                  </div>
                ))
              ) : (
                <p className="empty-column">No candidates in this stage</p>
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PipelineBoard;
