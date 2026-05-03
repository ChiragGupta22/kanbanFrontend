import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/auth.services";
import { getMember, addMember, removeMember } from "../../services/teammember";

const Teammember = () => {
  const { teamId } = useParams();

  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    fetchMembers();
    fetchUsers();
  }, [teamId]);

  const fetchMembers = async () => {
    try {
      const data = await getMember(teamId);
      setMembers(data.data || []);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/user");
      setUsers(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeMember(teamId, userId);

      setMembers((prev) =>
        prev.filter((m) => m.user?.id !== userId && m.userId !== userId),
      );

      alert("Member removed");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.message);
    }
  };
  const handleAdd = async (userId) => {
    try {
      console.log({
        teamId,
        userId,
      });

      await addMember(teamId, userId);
      alert("added team ");

      fetchMembers();
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Request failed");
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => !members.some((m) => m.userId === u.id))
    : [];

  const visibleUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Team Members</h2>

      <div className="space-y-2">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <p>{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <div className="flex gap-5">
              <button
                onClick={() => handleRemove(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                remove
              </button>

              <button
                onClick={() => handleAdd(user.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={page * limit >= filteredUsers.length}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <h3 className="mt-6 font-semibold">Added Members</h3>

      <div className="flex flex-wrap gap-2 mt-2">
        {members.map((m) => (
          <span key={m.id} className="bg-gray-200 px-2 py-1 text-xs rounded">
            {m.user?.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Teammember;
