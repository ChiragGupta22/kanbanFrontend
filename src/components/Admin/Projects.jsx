import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/auth.services";

const Projects = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamId) fetchProjects();
  }, [teamId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/project?teamId=${teamId}`);
      setProjects(res.data.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async () => {
    const name = prompt("Enter project name");
    const description = prompt("Enter description");

    if (!name || !description) return;

    try {
      const res = await API.post("/project", {
        name,
        description,
        teamId,
      });

      setProjects((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>

        <button
          onClick={addProject}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
        >
          + Create Project
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/admin/projects/${p.id}/board`)}
              className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer hover:scale-[1.02]"
            >
              {/* NAME */}
              <h3 className="text-lg font-semibold mb-2">{p.name}</h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {p.description}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Click to open</span>

                <span className="bg-blue-500 text-white px-2 py-1 rounded">
                  Board →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
