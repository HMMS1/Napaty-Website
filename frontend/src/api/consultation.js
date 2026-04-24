import api from "./api";

// ✅ Experts list
export const fetchExperts = async () => {
  const res = await api.get("/api/communication/experts/");
  return res.data;
};

// ✅ Create consultation request
export const createConsultationRequest = async (payload) => {
  const res = await api.post("/api/communication/requests/create/", payload);
  return res.data;
};

// ✅ User requests
export const fetchMyRequests = async () => {
  const res = await api.get("/api/communication/requests/");
  return res.data;
};

// ✅ Expert requests
export const fetchExpertRequests = async () => {
  const res = await api.get("/api/communication/expert/requests/");
  return res.data;
};

// ✅ Update request status (backend wants: action = accept|reject|close)
export const updateRequestStatus = async (requestId, action) => {
  const url = `/api/communication/requests/${requestId}/status/`;

  const normalized =
    action === "accepted" ? "accept" :
    action === "rejected" ? "reject" :
    action;

  try {
    const res = await api.patch(url, { action: normalized });
    return res.data;
  } catch (e) {
    if (e?.response?.status === 405) {
      const res2 = await api.post(url, { action: normalized });
      return res2.data;
    }
    throw e;
  }
};

// ✅ Cancel consultation request by user
export const cancelConsultationRequest = async (requestId) => {
  const url = `/api/communication/requests/${requestId}/cancel/`;

  try {
    const res = await api.patch(url);
    return res.data;
  } catch (e) {
    if (e?.response?.status === 405) {
      const res2 = await api.post(url);
      return res2.data;
    }
    throw e;
  }
};

// ✅ Messages
export const fetchRequestMessages = async (requestId) => {
  const res = await api.get(`/api/communication/requests/${requestId}/messages/`);
  return res.data;
};

export const sendRequestMessage = async (requestId, text) => {
  const url = `/api/communication/requests/${requestId}/messages/`;
  const payloads = [{ message: text }, { text }, { content: text }];

  let lastErr = null;
  for (const p of payloads) {
    try {
      const res = await api.post(url, p);
      return res.data;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
};