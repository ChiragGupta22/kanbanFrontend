import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import API from "../../services/auth.services";
import { useAuth } from "../../context/AuthProvider";
import { uploadAvatar, getAvatar } from "../../services/avatar";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const { projectId } = useParams();
  const projectId = params.projectId || sessionStorage.getItem("projectId");
  const [project, setProject] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Project
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        const res = await API.get(`/project/${projectId}`);
        setProject(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProject();
  }, [projectId]);

  // 🔹 Fetch Avatar
  useEffect(() => {
    const fetchAvatar = async () => {
      const data = await getAvatar();
      if (data) setAvatar(data);
    };

    fetchAvatar();
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  // 🔥 Safe Avatar
  const avatarUrl =
    avatar?.trim() !== ""
      ? avatar
      : user?.avatar?.trim() !== ""
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "Guest",
          )}`;

  return (
    <div className="h-20 w-full bg-slate-900 flex items-center justify-between px-6 text-white">
      {/* PROJECT */}
      <h2 className="text-lg font-semibold">
        {project?.name || "no project Selected"}
      </h2>

      {/* SEARCH */}
      <div className="w-[40%] relative">
        <Search className="absolute left-3 top-2 text-gray-400" />
        <input
          className="w-full pl-10 p-2 bg-slate-700 rounded outline-none"
          placeholder="Search..."
        />
      </div>

      {/* USER */}
      <div className="relative flex items-center gap-4">
        <Bell />

        {/* CLICK AVATAR */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-500 animate-pulse" />
          ) : (
            <img
              src={avatarUrl}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
              alt="avatar"
            />
          )}
          <span className="text-sm">{user?.name || "Guest"}</span>
        </div>

        {/* 🔥 DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-14 bg-slate-800 p-4 rounded-lg shadow-lg w-56 space-y-3 z-50">
            {/* AUTO UPLOAD INPUT */}
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                try {
                  setLoading(true);

                  const data = await uploadAvatar(file);
                  const newAvatar = data?.avatar;

                  // 🔥 update global user
                  setUser((prev) => ({
                    ...prev,
                    avatar: newAvatar,
                  }));

                  // 🔥 instant UI update
                  setAvatar(newAvatar);

                  setOpen(false);
                } catch (err) {
                  console.log("UPLOAD ERROR:", err);
                } finally {
                  setLoading(false);
                }
              }}
            />

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
