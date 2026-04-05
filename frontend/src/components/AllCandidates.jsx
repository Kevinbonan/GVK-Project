import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../App";
import "./AllCandidates.css";
import ExportButton from "./ExportButton";
import { handleMessage } from "./LoginPage";
import Alert from "@mui/material/Alert";

function AllCandidates() {
  const [message, setMessage] = useState("");
  const [candidatesList, setCandidatesList] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    ×©×: "",
    ×ª×¤×§×™×“: "",
    "×¡×™×›×•× ×©×™×—×ª ×˜×œ×¤×•×Ÿ": "",
    "×ª××¨×™×š ×©×™×—×ª ×˜×œ×¤×•×Ÿ": "",
    "×¡×™×›×•× ×¨×™××™×•×Ÿ": "",
    "×©× ×•×ª × ×™×¡×™×•×Ÿ": "",
    "×¡×™×•×•×’ ×‘×™×˜×—×•× ×™": false,
    ×‘×˜×™×—×•×ª: false,
    "'101'": false,
    "×ª××¨×™×š ×¨×™××™×•×Ÿ": "",
    ×¦×™×•×Ÿ: "",
    "× ×™×¡×™×•×Ÿ ×‘×©×˜×—": "",
    "×ž×™×“×¢ × ×•×¡×£": "",
  });
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
    setFormData({ ...candidate });
  };

  const handleFieldChange = (e, field) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const saveUpdatedCandidate = async (id) => {
    try {
      const response = await axios.put(
        BASE_URL + "/updateCandidate/" + id,
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setCandidatesList((prevList) =>
          prevList.map((candidate) =>
            candidate._id.toString() === id
              ? { ...candidate, ...formData }
              : candidate
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
                              value={formData.×©×}
                              onChange={(e) => handleFieldChange(e, "×©×")}
                            />
                          </td>
                          <td>
                            <select
                              value={formData.×ª×¤×§×™×“}
                              onChange={(e) => handleFieldChange(e, "×ª×¤×§×™×“")}
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
                              value={formData["×¡×™×›×•× ×©×™×—×ª ×˜×œ×¤×•×Ÿ"]}
                              onChange={(e) =>
                                handleFieldChange(e, "×¡×™×›×•× ×©×™×—×ª ×˜×œ×¤×•×Ÿ")
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={formData["×ª××¨×™×š ×©×™×—×ª ×˜×œ×¤×•×Ÿ"]}
                              onChange={(e) =>
                                handleFieldChange(e, "×ª××¨×™×š ×©×™×—×ª ×˜×œ×¤×•×Ÿ")
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={formData["×¡×™×›×•× ×¨×™××™×•×Ÿ"]}
                              onChange={(e) => handleFieldChange(e, "×¡×™×›×•× ×¨×™××™×•×Ÿ")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={formData["×©× ×•×ª × ×™×¡×™×•×Ÿ"]}
                              onChange={(e) => handleFieldChange(e, "×©× ×•×ª × ×™×¡×™×•×Ÿ")}
                              min={0}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={formData["×¡×™×•×•×’ ×‘×™×˜×—×•× ×™"]}
                              onChange={(e) =>
                                handleFieldChange(e, "×¡×™×•×•×’ ×‘×™×˜×—×•× ×™")
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={formData.×‘×˜×™×—×•×ª}
                              onChange={(e) => handleFieldChange(e, "×‘×˜×™×—×•×ª")}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={formData["'101'"]}
                              onChange={(e) => handleFieldChange(e, "'101'")}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={formData["×ª××¨×™×š ×¨×™××™×•×Ÿ"]}
                              onChange={(e) => handleFieldChange(e, "×ª××¨×™×š ×¨×™××™×•×Ÿ")}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={formData.×¦×™×•×Ÿ}
                              onChange={(e) => handleFieldChange(e, "×¦×™×•×Ÿ")}
                              min={0}
                              max={5}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={formData["× ×™×¡×™×•×Ÿ ×‘×©×˜×—"]}
                              onChange={(e) => handleFieldChange(e, "× ×™×¡×™×•×Ÿ ×‘×©×˜×—")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={formData["×ž×™×“×¢ × ×•×¡×£"]}
                              onChange={(e) => handleFieldChange(e, "×ž×™×“×¢ × ×•×¡×£")}
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
                          <td>{candidate.×©×}</td>
                          <td>{candidate.×ª×¤×§×™×“}</td>
                          <td>{candidate["×¡×™×›×•× ×©×™×—×ª ×˜×œ×¤×•×Ÿ"]}</td>
                          <td>{candidate["×ª××¨×™×š ×©×™×—×ª ×˜×œ×¤×•×Ÿ"]}</td>
                          <td>{candidate["×¡×™×›×•× ×¨×™××™×•×Ÿ"]}</td>
                          <td>{candidate["×©× ×•×ª × ×™×¡×™×•×Ÿ"]}</td>
                          <td>{candidate["×¡×™×•×•×’ ×‘×™×˜×—×•× ×™"]?.toString()}</td>
                          <td>{candidate["×‘×˜×™×—×•×ª"]?.toString()}</td>
                          <td>{candidate["'101'"]?.toString()}</td>
                          <td>{candidate["×ª××¨×™×š ×¨×™××™×•×Ÿ"]}</td>
                          <td>{candidate.×¦×™×•×Ÿ}</td>
                          <td>{candidate["× ×™×¡×™×•×Ÿ ×‘×©×˜×—"]}</td>
                          <td>{candidate["×ž×™×“×¢ × ×•×¡×£"]}</td>
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
