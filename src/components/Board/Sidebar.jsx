import React, { useEffect, useState } from "react";
import { LayoutDashboard, Settings, User } from "lucide-react";
import { useAuth } from "../../context/AuthProvider";
import { getAllTeam } from "../../services/team.services";
import API from "../../services/auth.services";
import { getAvatar } from "../../services/avatar";

const Sidebar = ({ setView, setProjectId, setTeamId }) => {
  const { user } = useAuth();

  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);

  const [showLogout, setShowLogout] = useState(false);
  const [avatar, setAvatar] = useState("");

  // 🔹 Fetch Avatar
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const data = await getAvatar();
        if (data) setAvatar(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAvatar();
  }, []);

  // 🔹 Fetch Teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getAllTeam();
        setTeams(res.team || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTeams();
  }, [user]);

  // 🔹 Load Projects
  const loadProjects = async (teamId) => {
    try {
      const res = await API.get(`/project?teamId=${teamId}`);
      setProjects(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="h-screen w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800">
        {/* HEADER */}
        <div className="p-4 space-y-2 border-b border-slate-800">
          <div
            onClick={() => setView("BOARD")}
            className="flex items-center gap-3 p-2 hover:bg-slate-800 cursor-pointer"
          >
            <LayoutDashboard size={18} />
            <span>Board</span>
          </div>

          <div
            onClick={() => setView("MY_TASKS")}
            className="flex items-center gap-3 p-2 hover:bg-slate-800 cursor-pointer"
          >
            <User size={18} />
            <span>My Tasks</span>
          </div>

          <div className="flex items-center gap-3 p-2 hover:bg-slate-800 cursor-pointer">
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 overflow-y-auto">
          {/* TEAMS */}
          <div className="p-4 border-b border-slate-800">
            <p className="text-xs text-gray-500 mb-3">TEAMS</p>

            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => {
                  setActiveTeam(team.id);
                  setTeamId(team.id);
                  loadProjects(team.id);
                }}
                className={`p-2 cursor-pointer hover:bg-slate-800 ${
                  activeTeam === team.id ? "bg-slate-800" : ""
                }`}
              >
                {team.name}
              </div>
            ))}
          </div>

          {/* PROJECTS */}
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-3">PROJECTS</p>

            {projects.length === 0 ? (
              <p className="text-sm text-gray-400">Select a team</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setProjectId(project.id);
                    setView("BOARD");
                  }}
                  className="p-2 hover:bg-slate-800 cursor-pointer"
                >
                  {project.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* USER FOOTER */}
        <div className="p-4 border-t border-slate-800 flex items-center gap-3">
          <img
            onClick={() => setShowLogout(true)}
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${user?.name || "Guest"}`
            }
            className="w-12 h-12 rounded-full object-cover border cursor-pointer"
            alt="user-avatar"
          />

          <div>
            <p>{user?.name || "Guest"}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </aside>

      {/* 🔥 LOGOUT MODAL (OUTSIDE SIDEBAR) */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 text-white p-5 rounded-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Do you want to logout?
            </h2>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
