import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { LayoutDashboard, Users, Settings } from "lucide-react";

import { getAllTeam } from "../../services/team.services";
import { getMember } from "../../services/teammember";
import { getProjectsByTeam } from "../../services/projects.services";

import Teams from "./Teams";
import Teammember from "./Teammember";
import Projects from "./Projects";
import Board from "./Board";
import AdminHome from "./AdminHome";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  // ✅ TEAMS
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getAllTeam();
        setTeams(data?.team || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTeams();
  }, []);

  // ✅ MEMBERS
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMember();
        setMembers(data?.user || data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMembers();
  }, []);

  // ✅ PROJECTS (IMPORTANT FIX)

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Teams", path: "/admin/teams", icon: <Users size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-800 p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

          <div className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-300 mb-2">{user?.name}</p>

          <button
            onClick={() => setOpen(true)}
            className="w-full bg-gray-700 py-2 rounded flex items-center justify-center gap-2"
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-16 bg-gray-800 flex items-center justify-between px-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <span className="text-sm text-gray-400">Welcome, {user?.name}</span>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={<AdminHome teams={teams} members={members} />}
            />

            <Route
              path="teams"
              element={<Teams teams={teams} setTeams={setTeams} />}
            />

            <Route path="teams/:teamId/members" element={<Teammember />} />

            {/* ✅ ADD THIS */}
            <Route path="teams/:teamId/projects" element={<Projects />} />

            <Route path="projects/:projectId/board" element={<Board />} />

            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black p-5 rounded-lg w-64 text-center"
          >
            <p className="mb-4 font-semibold">Account Settings</p>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-2 rounded w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
