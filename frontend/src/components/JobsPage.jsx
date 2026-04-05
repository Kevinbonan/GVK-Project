import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { BASE_URL } from "../App";
import "./JobsPage.css";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    status: "open",
    keywords: "",
    match_threshold: 60,
  });

  const fetchJobs = async () => {
    const response = await axios.get(`${BASE_URL}/jobs`, {
      withCredentials: true,
    });
    setJobs(response.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addJob = async (event) => {
    event.preventDefault();
    await axios.post(`${BASE_URL}/jobs`, formData, {
      withCredentials: true,
    });
    setFormData({
      title: "",
      department: "",
      location: "",
      status: "open",
      keywords: "",
      match_threshold: 60,
    });
    fetchJobs();
  };

  const updateJobStatus = async (jobId, status) => {
    await axios.put(
      `${BASE_URL}/jobs/${jobId}`,
      { status },
      { withCredentials: true }
    );
    fetchJobs();
  };

  const deleteJob = async (jobId) => {
    await axios.delete(`${BASE_URL}/jobs/${jobId}`, {
      withCredentials: true,
    });
    fetchJobs();
  };

  return (
    <div className="jobs-page">
      <Navbar />
      <main className="page-shell jobs-shell">
        <section className="page-header">
          <div>
            <div className="eyebrow">Position Configuration</div>
            <h1>Jobs and matching rules</h1>
            <p>
              Configure openings, keyword expectations and first-screening
              thresholds to support a more consistent CV triage process.
            </p>
          </div>
          <span className="status-pill">{jobs.length} configured jobs</span>
        </section>

        <div className="jobs-layout">
          <form className="job-form section-card" onSubmit={addJob}>
            <div>
              <div className="eyebrow">New Job</div>
              <h3>Create a role profile</h3>
              <p>
                Define the position metadata and the keyword logic used for the
                first CV screening pass.
              </p>
            </div>
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
            />
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <textarea
              name="keywords"
              placeholder="Keywords separated by commas"
              value={formData.keywords}
              onChange={handleChange}
            />
            <input
              name="match_threshold"
              type="number"
              min="0"
              max="100"
              placeholder="Minimum match percentage"
              value={formData.match_threshold}
              onChange={handleChange}
            />
            <button type="submit">Create Job</button>
          </form>

          <div className="jobs-list">
            {jobs.map((job) => (
              <article key={job._id} className="job-card section-card">
                <div className="job-card-main">
                  <div className="job-card-top">
                    <strong>{job.title}</strong>
                    <span className="status-pill">{job.status || "open"}</span>
                  </div>
                  <p>{job.department || "No department specified"}</p>
                  <p>{job.location || "No location specified"}</p>
                  <p className="job-keywords">
                    Keywords: {(job.keywords || []).join(", ") || "None"}
                  </p>
                  <p className="job-keywords">
                    Threshold: {job.match_threshold ?? 60}%
                  </p>
                </div>
                <div className="job-actions">
                  <select
                    value={job.status || "open"}
                    onChange={(event) => updateJobStatus(job._id, event.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    type="button"
                    className="danger-action"
                    onClick={() => deleteJob(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobsPage;
