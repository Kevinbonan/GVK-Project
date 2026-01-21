import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../App";
import "./AllCandidates.css";
import gvkLogo from "../assets/gvk-logo.png";
import ExportButton from "./ExportButton";
import { handleMessage } from "./LoginPage";
import Alert from "@mui/material/Alert";

function AllCandidates() {
  const [message, setMessage] = useState("");
  const [candidatesList, setCandidatesList] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    שם: "",
    תפקיד: "",
    "סיכום שיחת טלפון": "",
    "תאריך שיחת טלפון": "",
    "סיכום ריאיון": "",
    "שנות ניסיון": "",
    "סיווג ביטחוני": false,
    בטיחות: false,
    "'101'": false,
    "תאריך ריאיון": "",
    ציון: "",
    "ניסיון בשטח": "",
    "מידע נוסף": "",
  });
  const jobOptions = ["טכנאי", "אחר"];

  // Fetch candidates
  const getAllCandidates = async () => {
    try {
      const response = await axios.get(BASE_URL + "/allCandidates", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setCandidatesList(response.data);
      } else {
        console.log(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // Delete candidate
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
      } else {
        console.log(`Error deleting candidate: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate._id);
    setFormData({ ...candidate });
  };

  // Handle input changes
  const handleFieldChange = (e, field) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  // Save updated candidate
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
      } else {
        console.log(`Error updating candidate: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  useEffect(() => {
    getAllCandidates(); // Fetch candidates on component mount
  }, []);

  return (
    <div className="container">
      <div className="div-logo">
        <img src={gvkLogo} alt="GVK Logo" className="logo" />
      </div>
      <Navbar />
      {candidatesList.length > 0 ? (
        <div className="table-container">
          <div>
            {message && <Alert severity="success">{message}</Alert>}
            <ExportButton />
          </div>
          <table className="table">
            <thead className="thead">
              <tr>
                <th>שם</th>
                <th>תפקיד</th>
                <th>סיכום שיחת טלפון</th>
                <th>תאריך שיחת טלפון</th>
                <th>סיכום ריאיון</th>
                <th>שנות ניסיון</th>
                <th>סיווג ביטחוני</th>
                <th>בטיחות</th>
                <th>101</th>
                <th>תאריך ריאיון</th>
                <th>ציון</th>
                <th>ניסיון בשטח</th>
                <th>מידע נוסף</th>
                <th>/</th>
                <th>#</th>
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
                          value={formData.שם}
                          onChange={(e) => handleFieldChange(e, "שם")}
                        />
                      </td>
                      <td>
                        <select
                          value={formData.תפקיד}
                          onChange={(e) => handleFieldChange(e, "תפקיד")}
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
                          value={formData["סיכום שיחת טלפון"]}
                          onChange={(e) =>
                            handleFieldChange(e, "סיכום שיחת טלפון")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={formData["תאריך שיחת טלפון"]}
                          onChange={(e) =>
                            handleFieldChange(e, "תאריך שיחת טלפון")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={formData["סיכום ריאיון"]}
                          onChange={(e) => handleFieldChange(e, "סיכום ריאיון")}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={formData["שנות ניסיון"]}
                          onChange={(e) => handleFieldChange(e, "שנות ניסיון")}
                          min={0}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={formData["סיווג ביטחוני"]}
                          onChange={(e) =>
                            handleFieldChange(e, "סיווג ביטחוני")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={formData.בטיחות}
                          onChange={(e) => handleFieldChange(e, "בטיחות")}
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
                          value={formData["תאריך ריאיון"]}
                          onChange={(e) => handleFieldChange(e, "תאריך ריאיון")}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={formData.ציון}
                          onChange={(e) => handleFieldChange(e, "ציון")}
                          min={0}
                          max={5}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={formData["ניסיון בשטח"]}
                          onChange={(e) => handleFieldChange(e, "ניסיון בשטח")}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={formData["מידע נוסף"]}
                          onChange={(e) => handleFieldChange(e, "מידע נוסף")}
                        />
                      </td>
                      <td className="button-td">
                        <button
                          onClick={() => saveUpdatedCandidate(candidate._id)}
                        >
                          שמור
                        </button>
                        <button onClick={() => setEditingCandidate(null)}>
                          בטל
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{candidate.שם}</td>
                      <td>{candidate.תפקיד}</td>
                      <td>{candidate["סיכום שיחת טלפון"]}</td>
                      <td>{candidate["תאריך שיחת טלפון"]}</td>
                      <td>{candidate["סיכום ריאיון"]}</td>
                      <td>{candidate["שנות ניסיון"]}</td>
                      <td>{candidate["סיווג ביטחוני"]?.toString()}</td>
                      <td>{candidate["בטיחות"]?.toString()}</td>
                      <td>{candidate["'101'"]?.toString()}</td>
                      <td>{candidate["תאריך ריאיון"]}</td>
                      <td>{candidate.ציון}</td>
                      <td>{candidate["ניסיון בשטח"]}</td>
                      <td>{candidate["מידע נוסף"]}</td>
                      <td>
                        <button onClick={() => handleEdit(candidate)}>
                          ערוך
                        </button>
                      </td>
                      <td>
                        <button onClick={() => deleteCandidate(candidate._id)}>
                          מחק
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
        <p>No candidates found.</p>
      )}
    </div>
  );
}

export default AllCandidates;
