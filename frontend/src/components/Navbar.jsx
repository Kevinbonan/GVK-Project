import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const linksList = [
    { name: "הוסף מועמד חדש", link: "/addCandidate" },
    { name: "התנתק", link: "/logout" },
    { name: "כל המועמדים", link: "/allCandidates" },
  ];

  function getCurrentURL() {
    return window.location.pathname;
  }

  const currentURL = getCurrentURL();

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {linksList
          .filter((item) => item.link !== currentURL)
          .map((item, index) => (
            <li className="navbar-item" key={index}>
              <Link to={item.link}>{item.name}</Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export default Navbar;
