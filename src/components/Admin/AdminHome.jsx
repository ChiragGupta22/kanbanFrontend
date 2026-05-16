import { Users, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminHome = ({ teams = [], members = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="text-white space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-wide">Welcome Admin</h1>
        <p className="text-gray-400 mt-1">
          Manage your teams and members easily
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TEAMS */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm text-blue-200">Total Teams</h2>
              <p className="text-3xl font-bold mt-1">{teams.length}</p>
            </div>
            <Users size={30} className="text-white opacity-80" />
          </div>
        </div>

        {/* MEMBERS (CLICKABLE) */}
        <div
          onClick={() => navigate("/admin/all-members")}
          className="bg-gradient-to-r from-green-600 to-green-800 p-5 rounded-2xl shadow-lg hover:scale-105 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm text-green-200">Total Members</h2>
              <p className="text-3xl font-bold mt-1">{members.length}</p>
            </div>
            <Layers size={30} className="text-white opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
