import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

function Navbar() {
  let location = useLocation();
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/login");
    window.location.reload();
  }

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark" style={{ backgroundColor: "black" }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/" style={{ fontWeight: "bold" }}>DigitalNoteBook</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
            </li> */}
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} aria-current="page" to="/allnotes">AllNotes</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/aboutUs" ? "active" : ""}`} aria-current="page" to="/favourites">Favourites</Link>
            </li>
          </ul>
          {!localStorage.getItem("auth-token") ? (
            <div>
              <Link type="button" to="/login" className="btn btn-outline-light mx-1">Login</Link>
              <Link type="button" to="/signup" className="btn btn-outline-light mx-1">Signup</Link>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <Link to="/settings" className="btn btn-outline-light mx-1" aria-label="Settings">
                <FaCog />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-danger mx-1"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
