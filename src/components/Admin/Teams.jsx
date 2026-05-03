import { useEffect, useState } from "react";
import {
  getAllTeam,
  createTeam,
  deleteTeamById,
  updateTeam as updateTeamService,
} from "../../services/team.services";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navi = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await getAllTeam();
      setTeams(data.team);
    } catch (err) {
      console.log(err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async () => {
    const name = prompt("Enter team name");
    if (!name) return;

    try {
      const data = await createTeam(name);
      const newTeam = data?.team || data;
      setTeams((prev) => [...prev, newTeam]);
    } catch (err) {
      alert("Not allowed");
    }
  };

  const deleteTeam = async (id) => {
    if (!window.confirm("Delete this team?")) return;

    try {
      const res = await deleteTeamById(id);
      console.log("DELETE SUCCESS:", res);

      setTeams((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.log("DELETE ERROR FULL:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const updateTeam = async (id) => {
    const name = prompt("Enter new name");
    if (!name) return;

    try {
      await updateTeamService(id, name);
      setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
    } catch (err) {
      alert("Only owner can edit");
    }
  };

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Teams</h2>

        <button
          onClick={addTeam}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
        >
          + Create Team
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : teams.length === 0 ? (
        <p className="text-gray-400">No teams found</p>
      ) : (
        /* GRID CARDS */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* TEAM NAME */}
              <h3 className="text-lg font-semibold mb-3">{team.name}</h3>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  onClick={() => navi(`/admin/teams/${team.id}/members`)}
                  className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                >
                  Members
                </button>

                <button
                  onClick={() => navi(`/admin/teams/${team.id}/projects`)}
                  className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                >
                  Projects
                </button>

                <button
                  onClick={() => updateTeam(team.id)}
                  className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTeam(team.id)}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
