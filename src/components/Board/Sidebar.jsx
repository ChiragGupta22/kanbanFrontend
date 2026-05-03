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

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchAvatar = async () => {
      const data = await getAvatar();
      console.log("AVATAR RESULT:", data);

      if (data) {
        setAvatar(data);
      }
    };

    fetchAvatar();
  }, [location]);

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await getAllTeam();
      setTeams(res.team || []);
    };
    fetchTeams();
  }, [user]);

  const loadProjects = async (teamId) => {
    try {
      const res = await API.get(`/project?teamId=${teamId}`);
      setProjects(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
              className="p-2 hover:bg-slate-800 cursor-pointer"
            >
              {team.name}
            </div>
          ))}
        </div>

        {/* PROJECTS */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-3">PROJECTS</p>

          {projects.length === 0 ? (
            <p>Select a team</p>
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

      {/* ✅ USER AVATAR (FIXED) */}
      <div className="p-4 border-t border-slate-800 flex items-center gap-3">
        <img
          src={
            avatar ||
            `https://ui-avatars.com/api/?name=${user?.name || "Guest"}`
          }
          className="w-12 h-12 rounded-full object-cover border"
          alt="user-avatar"
        />

        <div>
          <p>{user?.name || "Guest"}</p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
