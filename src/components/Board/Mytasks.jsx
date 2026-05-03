import React, { useEffect, useState } from "react";
import { getMyIssues } from "../../services/issue.services";
import { useAuth } from "../../context/AuthProvider";

const MyTasks = () => {
  const { user } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyIssues();
        setIssues(data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4">My Tasks ({user?.name})</h1>

      {error && <div className="bg-red-500 p-2 rounded mb-3">{error}</div>}

      {issues.length === 0 ? (
        <p className="text-gray-400">No tasks assigned</p>
      ) : (
        issues.map((i) => (
          <div key={i.id} className="bg-gray-800 p-3 rounded mb-2">
            <h2>{i.title}</h2>
            <p className="text-xs text-gray-400">{i.project?.name}</p>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded">
              {i.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default MyTasks;
