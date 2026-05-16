import { useEffect, useState } from "react";
import { getAllTeam } from "../../services/team.services";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const UserTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // ---------------- FETCH TEAMS ----------------
  const fetchTeams = async () => {
    try {
      setLoading(true);

      const res = await getAllTeam();
      setTeams(res.team || []);
    } catch (err) {
      console.log(err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6 text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Welcome {user?.name || "User"} 👋
        </h2>
        <p className="text-gray-400 text-sm">Select a team to continue</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : teams.length === 0 ? (
        <p className="text-gray-400">No teams found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => {
                sessionStorage.setItem("teamId", team.id);

                navigate(`/teams/${team.id}/projects`);
              }}
              className="bg-gray-800 p-5 rounded-xl cursor-pointer hover:bg-gray-700"
            >
              <h3 className="text-lg font-semibold">{team.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTeams;
