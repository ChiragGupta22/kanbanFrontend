import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import KanbanBoard from "./KanbanBoard";
import MyTasks from "./MyTasks";

const Dashboard = () => {
  const { user } = useAuth();

  const [view, setView] = useState("BOARD");

  // 🔥 ADD TEAM ALSO
  const [teamId, setTeamId] = useState(null);
  const [projectId, setProjectId] = useState(null);

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* PASS BOTH */}
      <Sidebar
        setView={setView}
        setTeamId={setTeamId}
        setProjectId={setProjectId}
      />

      <div className="flex-1 flex flex-col">
        <Navbar projectId={projectId} teamId={teamId} />

        <div className="flex-1 overflow-hidden">
          {view === "BOARD" && (
            <KanbanBoard projectId={projectId} teamId={teamId} />
          )}

          {view === "MY_TASKS" && <MyTasks />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
