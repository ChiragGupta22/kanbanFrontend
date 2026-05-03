import API from "./auth.services";

// CREATE PROJECT
export const createProject = async (name, description, teamId) => {
  const res = await API.post("/project", {
    name,
    description,
    teamId,
  });
  return res.data;
};

export const getProjectsByTeam = async (teamId) => {
  const res = await API.get(`/project/team-projects?teamId=${teamId}`);
  return res.data;
};
