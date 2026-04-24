import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_ORIGIN =
  process.env.REACT_APP_BACKEND_ORIGIN || "http://127.0.0.1:8000";

// ✅ غيّر ده لو مسار communication في الباك مختلف
const COMMUNICATION_BACK_PATH = "/communication/";

export default function CommunicationRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(
    () => localStorage.getItem("access") || localStorage.getItem("token"),
    []
  );

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const state = location.state || {};
    const requestId = state.requestId;
    const conversationId = state.conversationId;

    // نبني لينك للباك
    const url = new URL(`${BACKEND_ORIGIN}${COMMUNICATION_BACK_PATH}`);
    if (requestId) url.searchParams.set("request_id", requestId);
    if (conversationId) url.searchParams.set("conversation_id", conversationId);

    // ✅ روح للباك مباشرة
    window.location.href = url.toString();
  }, [location.state, navigate, token]);

  return (
    <div style={{ padding: 20 }}>
      <h3>جاري فتح صفحة التواصل...</h3>
      <p>لو ما اتحوّلتش تلقائيًا، تأكد إن الباك شغال على {BACKEND_ORIGIN}.</p>
    </div>
  );
}
