import { NavLink } from "react-router-dom";
import gvkLogo from "../assets/gvk-logo.png";
import "./Navbar.css";

function Navbar() {
  const linksList = [
    { name: "Add Candidate", link: "/addCandidate" },
    { name: "Candidates", link: "/allCandidates" },
    { name: "Pipeline", link: "/pipeline" },
    { name: "Jobs", link: "/jobs" },
    { name: "Logout", link: "/logout" },
  ];

  return (
    <header className="navbar-shell">
      <nav className="navbar page-shell">
        <div className="navbar-brand">
          <img src={gvkLogo} alt="GVK Logo" className="navbar-logo" />
          <div>
            <strong>GVK Talent Operations</strong>
            <span>Industrial recruitment control center</span>
          </div>
        </div>

        <ul className="navbar-list">
          {linksList.map((item) => (
            <li className="navbar-item" key={item.link}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  isActive ? "navbar-link navbar-link-active" : "navbar-link"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
