import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { BASE_URL } from "../App";
import "./CandidateDetails.css";

const STATUSES = [
  "Applied",
  "HR Interview",
  "Technical Interview",
  "Offer",
  "Hired",
  "Rejected",
];

function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [history, setHistory] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [interviewForm, setInterviewForm] = useState({
    type: "HR Interview",
    date: "",
    interviewer: "",
    notes: "",
    score: "",
  });

  const fetchCandidate = async () => {
    const response = await axios.get(`${BASE_URL}/candidates/${id}`, {
      withCredentials: true,
    });
    setCandidate(response.data);
  };

  const fetchHistory = async () => {
    const response = await axios.get(`${BASE_URL}/candidates/${id}/history`, {
      withCredentials: true,
    });
    setHistory(response.data);
  };

  const fetchInterviews = async () => {
    const response = await axios.get(`${BASE_URL}/candidates/${id}/interviews`, {
      withCredentials: true,
    });
    setInterviews(response.data);
  };

  useEffect(() => {
    fetchCandidate();
    fetchHistory();
    fetchInterviews();
  }, [id]);

  const updateStatus = async (event) => {
    const status = event.target.value;
    await axios.put(
      `${BASE_URL}/candidates/${id}/status`,
      { status },
      { withCredentials: true }
    );
    fetchCandidate();
    fetchHistory();
  };

  const handleInterviewChange = (event) => {
    const { name, value } = event.target;
    setInterviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitInterview = async (event) => {
    event.preventDefault();
    await axios.post(
      `${BASE_URL}/candidates/${id}/interviews`,
      { ...interviewForm },
      { withCredentials: true }
    );
    setInterviewForm({
      type: "HR Interview",
      date: "",
      interviewer: "",
      notes: "",
      score: "",
    });
    fetchInterviews();
  };

  if (!candidate) {
    return (
      <div className="candidate-details-page">
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="candidate-details-page">
      <Navbar />
      <div className="candidate-card">
        <h2>{candidate["שם"] || candidate.fullName}</h2>
        <p>Role: {candidate["תפקיד"] || candidate.jobTitle}</p>
        <p>Email: {candidate.email || "N/A"}</p>
        <p>Phone: {candidate.phone || "N/A"}</p>
        <label>
          Status
          <select value={candidate.status || "Applied"} onChange={updateStatus}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="candidate-sections">
        <section>
          <h3>Interview Notes</h3>
          <form className="interview-form" onSubmit={submitInterview}>
            <select
              name="type"
              value={interviewForm.type}
              onChange={handleInterviewChange}
            >
              <option value="HR Interview">HR Interview</option>
              <option value="Technical Interview">Technical Interview</option>
            </select>
            <input
              name="date"
              type="date"
              value={interviewForm.date}
              onChange={handleInterviewChange}
            />
            <input
              name="interviewer"
              type="text"
              placeholder="Interviewer"
              value={interviewForm.interviewer}
              onChange={handleInterviewChange}
            />
            <input
              name="score"
              type="number"
              placeholder="Score"
              value={interviewForm.score}
              onChange={handleInterviewChange}
            />
            <textarea
              name="notes"
              placeholder="Notes"
              value={interviewForm.notes}
              onChange={handleInterviewChange}
            />
            <button type="submit">Add Interview</button>
          </form>
          <ul className="interview-list">
            {interviews.map((interview) => (
              <li key={interview._id}>
                <strong>{interview.type}</strong> - {interview.date}
                <p>{interview.notes}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Status History</h3>
          <ul className="history-list">
            {history.map((item) => (
              <li key={item._id}>
                {item.from_status} → {item.to_status} ({item.changed_at})
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default CandidateDetails;
