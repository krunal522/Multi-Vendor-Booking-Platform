import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
    <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.1)" } }} />
  </AuthProvider>
);
