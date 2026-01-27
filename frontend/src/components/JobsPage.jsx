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
      <div className="jobs-layout">
        <form className="job-form" onSubmit={addJob}>
          <h3>Create Job</h3>
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
          <button type="submit">Add Job</button>
        </form>

        <div className="jobs-list">
          <h3>Open Positions</h3>
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div>
                <strong>{job.title}</strong>
                <p>{job.department}</p>
                <p>{job.location}</p>
              </div>
              <div className="job-actions">
                <select
                  value={job.status || "open"}
                  onChange={(event) =>
                    updateJobStatus(job._id, event.target.value)
                  }
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                <button type="button" onClick={() => deleteJob(job._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobsPage;
