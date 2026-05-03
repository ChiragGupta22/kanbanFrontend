import axios from "axios";

const API = axios.create({
  baseURL: "https://kanbanbackend-2-x4y5.onrender.com/api",
  withCredentials: true,
});

export const loginUser = async (email, password) => {
  const res = await API.post("/user/login", { email, password });
  return res.data;
};

export const registerUser = async (name, email, password, role) => {
  const res = await API.post("/user/register", { name, email, password, role });
  return res.data;
};

export default API;
