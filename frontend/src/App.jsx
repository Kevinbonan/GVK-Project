import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/LoginPage";
import Logout from "./components/LogOut";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AddCandidate from "./components/AddCandidate";
import AllCandidates from "./components/AllCandidates";
import PipelineBoard from "./components/PipelineBoard";
import CandidateDetails from "./components/CandidateDetails";
import JobsPage from "./components/JobsPage";
export const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/session`, {
          withCredentials: true,
        });

        if (isMounted) {
          setIsAuthenticated(Boolean(response.data?.isAuthenticated));
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  function ProtectedRoute({ isAuthenticated, isCheckingAuth, children }) {
    if (isCheckingAuth) {
      return <div className="page-shell">Checking session...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isCheckingAuth ? (
              <div className="page-shell">Checking session...</div>
            ) : isAuthenticated ? (
              <Navigate to="/addCandidate" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/addCandidate"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isCheckingAuth={isCheckingAuth}
            >
              <AddCandidate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={<Logout setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/allCandidates"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isCheckingAuth={isCheckingAuth}
            >
              <AllCandidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pipeline"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isCheckingAuth={isCheckingAuth}
            >
              <PipelineBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isCheckingAuth={isCheckingAuth}
            >
              <JobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidates/:id"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isCheckingAuth={isCheckingAuth}
            >
              <CandidateDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
