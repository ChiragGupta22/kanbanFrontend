import React, { useEffect, useState } from "react";
import { getIssues } from "../../services/issue.services";

const AllTasks = ({ projectId }) => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!projectId) return;

      const data = await getIssues(projectId);
      setIssues(data || []);
    };

    fetch();
  }, [projectId]);

  if (!projectId) {
    return <div className="text-white p-6">No Project Selected</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-5">All Tasks</h1>

      {issues.map((i) => (
        <div key={i.id} className="bg-gray-800 p-3 rounded mb-3">
          <h2 className="font-semibold">{i.title}</h2>
          <p className="text-xs text-gray-400">{i.project?.name}</p>
          <p className="text-xs text-yellow-400">{i.status}</p>
          <p className="text-xs text-green-400">{i.priority}</p>
          <p className="text-xs text-blue-400">
            {i.assignee?.name || "Unassigned"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AllTasks;
