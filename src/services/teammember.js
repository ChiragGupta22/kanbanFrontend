import API from "./auth.services";

export const addMember = async (teamId, userId) => {
  const res = await API.post("/member/add", {
    teamId: String(teamId),
    userId: String(userId),
    role: "USER",
  });

  return res.data;
};

export const getMember = async () => {
  const res = await API.get("/user/");
  return res.data;
};

export const getTeamMember = async (teamId) => {
  const res = await API.get(`/member/${teamId}`);
  return res.data;
};

export const removeMember = async (teamId, userId) => {
  const res = await API.delete("/member", {
    data: {
      teamId,
      userId,
    },
  });

  return res.data;
};
