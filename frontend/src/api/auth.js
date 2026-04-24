import axios from "axios";

const baseURL = "http://127.0.0.1:8000";

export const loginRequest = async (payload) => {
  const res = await axios.post(`${baseURL}/api/auth/login/`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const registerRequest = async (payload) => {
  const res = await axios.post(`${baseURL}/api/auth/register/`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
