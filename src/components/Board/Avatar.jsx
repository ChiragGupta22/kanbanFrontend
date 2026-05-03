import React, { useState } from "react";
import { uploadAvatar } from "../../services/avatar";
import { useAuth } from "../../context/AuthProvider";

const AvatarUpload = () => {
  const { setUser } = useAuth();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const data = await uploadAvatar(file);

      console.log("UPLOAD RESPONSE:", data);

      // 🔥 SAFE UPDATE
      setUser((prev) => ({
        ...prev,
        avatar: data?.avatar,
      }));

      alert("Avatar uploaded");
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
};

export default AvatarUpload;
