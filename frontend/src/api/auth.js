import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;


export const loginRequest = async (payload) => {
  const res = await axios.post(`${baseURL}/api/login/`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};


export const registerRequest = async (payload) => {
  const res = await axios.post(`${baseURL}/api/register/`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
