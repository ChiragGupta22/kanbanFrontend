import API from "./auth.services";

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const res = await API.post("/avatar", formData);

    console.log("UPLOAD RESPONSE:", res.data);

    // ✅ SAFE RETURN (important fix)
    return res.data?.data;
  } catch (err) {
    console.error("UPLOAD ERROR:", err.response?.data || err.message);
    return null;
  }
};

export const getAvatar = async () => {
  try {
    const res = await API.get("/avatar");

    console.log("GET AVATAR RESPONSE:", res.data);

    // backend: { message, data: post.avatar OR user }
    return res.data?.data;
  } catch (err) {
    console.error("GET AVATAR ERROR:", err.response?.data || err.message);
    return null;
  }
};
