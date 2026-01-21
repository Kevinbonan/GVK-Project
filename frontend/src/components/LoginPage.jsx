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
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        BASE_URL + "/login",
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        setMessage(response.data.message);
        handleLogin();
        navigate("/addCandidate");
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      handleMessage(error.response.data.message, setMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={gvkLogo} alt="GVK Logo" className="logo" />
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <PersonIcon /> שם משתמש:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="הכנס שם משתמש"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <PasswordIcon /> סיסמה:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="הכנס סיסמה"
              required
            />
          </div>
          <div class="error-div">
            {message && <Alert severity="error">{message}</Alert>}
          </div>
          <div className="bottom-div">
            <button type="submit" className="login-button">
              התחבר
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
