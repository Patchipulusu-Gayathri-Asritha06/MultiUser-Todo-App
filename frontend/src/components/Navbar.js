import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiCheckSquare, FiUser } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FiCheckSquare className="brand-icon" />
        <span>TaskFlow</span>
      </div>
      {user && (
        <div className="navbar-user">
          <div className="user-info">
            <FiUser size={14} />
            <span>{user.name}</span>
          </div>
          <button className="btn-logout" onClick={logout}>
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
