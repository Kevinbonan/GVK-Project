import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../App";
import "./AllCandidates.css";
import ExportButton from "./ExportButton";
import { handleMessage } from "./LoginPage";
import Alert from "@mui/material/Alert";
import {
  buildEmptyCandidate,
  getCandidateValue,
  primaryCandidateKey,
} from "./candidateFields";

const NAME_KEY = primaryCandidateKey("name");
const ROLE_KEY = primaryCandidateKey("role");
const PHONE_SUMMARY_KEY = primaryCandidateKey("phoneSummary");
const PHONE_DATE_KEY = primaryCandidateKey("phoneDate");
const INTERVIEW_SUMMARY_KEY = primaryCandidateKey("interviewSummary");
const YEARS_EXPERIENCE_KEY = primaryCandidateKey("yearsExperience");
const SECURITY_KEY = primaryCandidateKey("securityClearance");
const SAFETY_KEY = primaryCandidateKey("safety");
const FORM_101_KEY = primaryCandidateKey("form101");
const INTERVIEW_DATE_KEY = primaryCandidateKey("interviewDate");
const GRADE_KEY = primaryCandidateKey("grade");
const FIELD_EXPERIENCE_KEY = primaryCandidateKey("fieldExperience");
const ADDITIONAL_INFO_KEY = primaryCandidateKey("additionalInfo");

function AllCandidates() {
  const [message, setMessage] = useState("");
  const [candidatesList, setCandidatesList] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState(buildEmptyCandidate(""));
  const jobOptions = ["×˜×›× ××™", "××—×¨"];

  const getAllCandidates = async () => {
    try {
      const response = await axios.get(BASE_URL + "/allCandidates", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setCandidatesList(response.data);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const deleteCandidate = async (id) => {
    try {
      const response = await axios.delete(BASE_URL + "/deleteCandidate/" + id, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setCandidatesList((prevList) =>
          prevList.filter((candidate) => candidate._id !== id)
        );
        handleMessage(response.data.message, setMessage);
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate._id);
    setFormData({ ...buildEmptyCandidate(""), ...candidate });
  };

  const handleFieldChange = (e, field) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const saveUpdatedCandidate = async (id) => {
    try {
      const response = await axios.put(BASE_URL + "/updateCandidate/" + id, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setCandidatesList((prevList) =>
          prevList.map((candidate) =>
            candidate._id.toString() === id ? { ...candidate, ...formData } : candidate
          )
        );
        setEditingCandidate(null);
        handleMessage(response.data.message, setMessage);
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  useEffect(() => {
    getAllCandidates();
  }, []);

  return (
    <div className="records-page">
      <Navbar />
      <main className="page-shell records-shell">
        <section className="page-header">
          <div>
            <div className="eyebrow">Candidate Database</div>
            <h1>All candidates</h1>
            <p>
              Review the full applicant database, update technical details and
              keep operational recruitment records aligned across teams.
            </p>
          </div>
          <div className="records-actions">
            <span className="status-pill">{candidatesList.length} profiles</span>
            <ExportButton />
          </div>
        </section>

        <section className="section-card candidates-table-panel">
          {message && <Alert severity="success">{message}</Alert>}
          {candidatesList.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead className="thead">
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Phone Summary</th>
                    <th>Phone Date</th>
                    <th>Interview Summary</th>
                    <th>Years Exp.</th>
                    <th>Security</th>
                    <th>Safety</th>
                    <th>101</th>
                    <th>Interview Date</th>
                    <th>Grade</th>
                    <th>Field Experience</th>
                    <th>Additional Info</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {candidatesList.map((candidate, index) => (
                    <tr key={index}>
                      {editingCandidate === candidate._id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              value={getCandidateValue(formData, "name") || ""}
                              onChange={(e) => handleFieldChange(e, NAME_KEY)}
                            />
                          </td>
                          <td>
                            <select
                              value={getCandidateValue(formData, "role") || ""}
                              onChange={(e) => handleFieldChange(e, ROLE_KEY)}
                            >
                              {jobOptions.map((job, idx) => (
                                <option key={idx} value={job}>
                                  {job}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={getCandidateValue(formData, "phoneSummary") || ""}
                              onChange={(e) => handleFieldChange(e, PHONE_SUMMARY_KEY)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={getCandidateValue(formData, "phoneDate") || ""}
                              onChange={(e) => handleFieldChange(e, PHONE_DATE_KEY)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={getCandidateValue(formData, "interviewSummary") || ""}
                              onChange={(e) => handleFieldChange(e, INTERVIEW_SUMMARY_KEY)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={getCandidateValue(formData, "yearsExperience") || 0}
                              onChange={(e) => handleFieldChange(e, YEARS_EXPERIENCE_KEY)}
                              min={0}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={Boolean(getCandidateValue(formData, "securityClearance"))}
                              onChange={(e) => handleFieldChange(e, SECURITY_KEY)}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={Boolean(getCandidateValue(formData, "safety"))}
                              onChange={(e) => handleFieldChange(e, SAFETY_KEY)}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={Boolean(getCandidateValue(formData, "form101"))}
                              onChange={(e) => handleFieldChange(e, FORM_101_KEY)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={getCandidateValue(formData, "interviewDate") || ""}
                              onChange={(e) => handleFieldChange(e, INTERVIEW_DATE_KEY)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={getCandidateValue(formData, "grade") || 0}
                              onChange={(e) => handleFieldChange(e, GRADE_KEY)}
                              min={0}
                              max={5}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={getCandidateValue(formData, "fieldExperience") || ""}
                              onChange={(e) => handleFieldChange(e, FIELD_EXPERIENCE_KEY)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={getCandidateValue(formData, "additionalInfo") || ""}
                              onChange={(e) => handleFieldChange(e, ADDITIONAL_INFO_KEY)}
                            />
                          </td>
                          <td className="button-td">
                            <button onClick={() => saveUpdatedCandidate(candidate._id)}>
                              Save
                            </button>
                          </td>
                          <td className="button-td">
                            <button
                              className="secondary-action"
                              onClick={() => setEditingCandidate(null)}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{getCandidateValue(candidate, "name") || ""}</td>
                          <td>{getCandidateValue(candidate, "role") || ""}</td>
                          <td>{getCandidateValue(candidate, "phoneSummary") || ""}</td>
                          <td>{getCandidateValue(candidate, "phoneDate") || ""}</td>
                          <td>{getCandidateValue(candidate, "interviewSummary") || ""}</td>
                          <td>{getCandidateValue(candidate, "yearsExperience") || ""}</td>
                          <td>{String(Boolean(getCandidateValue(candidate, "securityClearance")))}</td>
                          <td>{String(Boolean(getCandidateValue(candidate, "safety")))}</td>
                          <td>{String(Boolean(getCandidateValue(candidate, "form101")))}</td>
                          <td>{getCandidateValue(candidate, "interviewDate") || ""}</td>
                          <td>{getCandidateValue(candidate, "grade") || ""}</td>
                          <td>{getCandidateValue(candidate, "fieldExperience") || ""}</td>
                          <td>{getCandidateValue(candidate, "additionalInfo") || ""}</td>
                          <td>
                            <button
                              className="secondary-action"
                              onClick={() => handleEdit(candidate)}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              className="danger-action"
                              onClick={() => deleteCandidate(candidate._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h3>No candidates found</h3>
              <p>Add a candidate to start building the recruitment database.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AllCandidates;
