import API from "./auth.services";

export const createTeam = async (name) => {
  const res = await API.post("/team/", { name });
  return res.data;
};

export const getAllTeam = async () => {
  const res = await API.get("/team");
  return res.data;
};
export const getTeamById = async (id) => {
  const res = await API.get(`/team/${id}`);
  return res.data;
};
export const deleteTeamById = async (id) => {
  const res = await API.delete(`/team/${id}`);
  return res.data;
};

export const updateTeam = async (id, name) => {
  const res = await API.put(`/team/${id}`, { name });
  return res.data;
};
