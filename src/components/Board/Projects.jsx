import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import API from "../../services/auth.services";

const UserProjects = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/project/team/${teamId}`);

      // 🔥 SAFE RESPONSE HANDLING
      const data = res?.data;

      setProjects(data?.data || data?.projects || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchProjects();
  }, [teamId]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Welcome {user?.name}</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects found in this team</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                sessionStorage.setItem("projectId", p.id);

                navigate(`/dashboard/${teamId}/${p.id}`);
              }}
              className="bg-gray-800 p-5 rounded-xl cursor-pointer hover:bg-gray-700"
            >
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-gray-400">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProjects;
