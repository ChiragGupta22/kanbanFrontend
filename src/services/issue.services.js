import API from "./auth.services";

// GET
export const getIssues = async (projectId) => {
  const res = await API.get("/issue", {
    params: { projectId },
  });
  return res.data.data;
};

export const getMyIssues = async () => {
  const res = await API.get("/issue/my");
  return res.data.data;
};

// CREATE
export const createIssue = async (data) => {
  const res = await API.post("/issue", data);
  return res.data.data;
};

// UPDATE
export const updateIssue = async (id, data) => {
  const res = await API.put(`/issue/${id}`, data);
  return res.data.data;
};

// DELETE
export const deleteIssue = async (id) => {
  const res = await API.delete(`/issue/${id}`);
  return res.data;
};
