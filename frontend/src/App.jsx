import React, { useState } from "react";
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
export const BASE_URL = "http://localhost:5000";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function ProtectedRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/" />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/addCandidate"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
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
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AllCandidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pipeline"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PipelineBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <JobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidates/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CandidateDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
