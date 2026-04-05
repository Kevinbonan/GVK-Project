import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import gvkLogo from "../assets/gvk-logo.png";
import "./LoginPage.css";
import PersonIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";
import axios from "axios";
import { BASE_URL } from "../App";
import Alert from "@mui/material/Alert";

export function handleMessage(content, setMessage) {
  setMessage(content);
  setTimeout(() => {
    setMessage("");
  }, 3000);
}

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        BASE_URL + "/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/addCandidate");
      }
    } catch (error) {
      handleMessage(error.response?.data?.message || "Login failed.", setMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-grid">
        <section className="login-intro">
          <div className="eyebrow">GVK Recruitment Platform</div>
          <img src={gvkLogo} alt="GVK Logo" className="logo" />
          <h1>Industrial talent management with operational clarity.</h1>
          <p>
            A premium internal workspace for recruitment teams handling
            technical, energy, and field-oriented hiring with consistency and
            speed.
          </p>
          <div className="login-metrics">
            <div className="login-metric">
              <strong>24/7</strong>
              <span>Operational mindset</span>
            </div>
            <div className="login-metric">
              <strong>B2B</strong>
              <span>Serious industrial UX</span>
            </div>
            <div className="login-metric">
              <strong>1 Hub</strong>
              <span>Jobs, pipeline, CV triage</span>
            </div>
          </div>
        </section>

        <section className="login-container">
          <div className="login-panel-header">
            <div className="eyebrow">Secure Access</div>
            <h2>Sign in to continue</h2>
            <p>Use your internal credentials to access the recruitment dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <span className="field-label">
                  <PersonIcon fontSize="small" /> Username
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder="Enter your username"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="field-label">
                  <PasswordIcon fontSize="small" /> Password
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </label>
            </div>

            <div className="error-div">
              {message && <Alert severity="error">{message}</Alert>}
            </div>

            <div className="bottom-div">
              <button type="submit" className="login-button">
                Access Dashboard
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
