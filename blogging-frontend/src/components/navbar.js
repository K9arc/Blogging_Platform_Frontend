import React from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">MyBlog</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/new">New Post</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">My Posts</Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex">
            {isLoggedIn ? (
              <button 
                className="btn btn-outline-danger" 
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-primary me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}