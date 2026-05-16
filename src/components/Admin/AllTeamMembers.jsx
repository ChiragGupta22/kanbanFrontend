import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMember } from "../../services/teammember";

const AllTeamMembers = () => {
  const { teamId } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const fetchMembers = async () => {
    try {
      const data = await getMember(teamId);
      setMembers(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-5">Team Members</h2>

      {members.length === 0 ? (
        <p>No members found</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="bg-gray-800 p-4 rounded">
              <p className="font-semibold">{m.user?.name}</p>
              <p className="text-sm text-gray-400">{m.user?.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTeamMembers;
