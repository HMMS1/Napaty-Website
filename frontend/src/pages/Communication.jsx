import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CommunicationRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("access") || localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const state = location.state || {};
    const requestId = state.requestId;

    if (requestId) {
      navigate(`/chat/${requestId}`, { replace: true });
    } else {
      // fallback
      navigate("/consultation", { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h3>جاري فتح المحادثة...</h3>
    </div>
  );
}
