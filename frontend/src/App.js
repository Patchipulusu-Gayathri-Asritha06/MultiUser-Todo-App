import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

const AppContent = () => {
  const { user, initializing } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (initializing) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading TaskFlow...</p>
      </div>
    );
  }

  if (!user) {
    return showRegister
      ? <Register onSwitch={() => setShowRegister(false)} />
      : <Login onSwitch={() => setShowRegister(true)} />;
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Dashboard />
      </main>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1e293b",
          color: "#f1f5f9",
          borderRadius: "10px",
          border: "1px solid #334155",
          fontSize: "14px",
        },
        success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }}
    />
    <AppContent />
  </AuthProvider>
);

export default App;
