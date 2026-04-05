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
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const fetchJobs = async () => {
    const response = await axios.get(`${BASE_URL}/jobs`, {
      withCredentials: true,
    });
    setJobs(response.data);
  };

  useEffect(() => {
    fetchCandidate();
    fetchHistory();
    fetchInterviews();
    fetchJobs();
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

  const submitCvAnalysis = async (event) => {
    event.preventDefault();
    if (!selectedJobId || !cvFile) {
      setAnalysisMessage("Please select a job and upload a PDF CV.");
      return;
    }

    const formData = new FormData();
    formData.append("job_id", selectedJobId);
    formData.append("cv", cvFile);

    setIsAnalyzing(true);
    setAnalysisMessage("");

    try {
      const response = await axios.post(
        `${BASE_URL}/candidates/${id}/analyze-cv`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCandidate((prev) => ({ ...prev, cv_analysis: response.data }));
      setAnalysisMessage("CV analyzed successfully.");
    } catch (error) {
      setAnalysisMessage(
        error.response?.data?.error || "CV analysis failed."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!candidate) {
    return (
      <div className="candidate-details-page">
        <Navbar />
        <main className="page-shell candidate-details-shell">
          <section className="page-header">
            <div>
              <div className="eyebrow">Candidate Profile</div>
              <h1>Loading profile</h1>
              <p>Fetching interview records, pipeline history and CV analysis data.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="candidate-details-page">
      <Navbar />
      <main className="page-shell candidate-details-shell">
        <section className="page-header">
          <div>
            <div className="eyebrow">Candidate Profile</div>
            <h1>{candidate["Ã—Â©Ã—Â"] || candidate.fullName || "Candidate details"}</h1>
            <p>
              Detailed recruitment record combining operational status,
              interview notes and automated CV screening.
            </p>
          </div>
          <span className="status-pill">{candidate.status || "Applied"}</span>
        </section>

        <section className="candidate-card">
          <div className="candidate-card-meta">
            <p>
              <strong>Role:</strong> {candidate["Ã—ÂªÃ—Â¤Ã—Â§Ã—â„¢Ã—â€œ"] || candidate.jobTitle || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {candidate.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {candidate.phone || "N/A"}
            </p>
          </div>

          <div className="candidate-card-status">
            <span className="status-pill">Operational status</span>
            <label>
              <span>Status</span>
              <select value={candidate.status || "Applied"} onChange={updateStatus}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

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
                  {item.from_status} to {item.to_status} ({item.changed_at})
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>CV Match Analysis</h3>
            <form className="interview-form" onSubmit={submitCvAnalysis}>
              <select
                value={selectedJobId}
                onChange={(event) => setSelectedJobId(event.target.value)}
              >
                <option value="">Select job</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} ({job.match_threshold || 60}%)
                  </option>
                ))}
              </select>
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setCvFile(event.target.files?.[0] || null)}
              />
              <button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : "Analyze CV"}
              </button>
            </form>

            {analysisMessage ? (
              <p className="analysis-message">{analysisMessage}</p>
            ) : null}

            {candidate.cv_analysis ? (
              <div className="analysis-card">
                <p>
                  <strong>Job:</strong> {candidate.cv_analysis.job_title}
                </p>
                <p>
                  <strong>Score:</strong> {candidate.cv_analysis.match_score}%
                </p>
                <p>
                  <strong>Required threshold:</strong>{" "}
                  {candidate.cv_analysis.match_threshold}%
                </p>
                <p>
                  <strong>First screening:</strong>{" "}
                  {candidate.cv_analysis.is_match ? "Accepted" : "Rejected"}
                </p>
                <p>
                  <strong>Matched keywords:</strong>{" "}
                  {candidate.cv_analysis.matched_keywords?.join(", ") || "None"}
                </p>
                <p>
                  <strong>Missing keywords:</strong>{" "}
                  {candidate.cv_analysis.missing_keywords?.join(", ") || "None"}
                </p>
                <p>
                  <strong>File:</strong> {candidate.cv_analysis.cv_filename}
                </p>
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}

export default CandidateDetails;
