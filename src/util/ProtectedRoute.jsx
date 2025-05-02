import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to login page
    }
  }, [user, navigate]);

  // Check if the user is authenticated
  return children;
}
