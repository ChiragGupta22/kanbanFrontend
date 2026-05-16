import { useState } from "react";

const AdminHome = ({ teams, members }) => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <div className="text-white">
      {/* STATS */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="bg-gray-800 p-5 rounded-xl">
          <h2 className="text-lg font-semibold">Total Teams</h2>
          <p className="text-3xl mt-2">{teams.length}</p>
        </div>

        {/* CLICKABLE MEMBERS CARD */}
        <div
          onClick={() => setShowMembers(!showMembers)}
          className="bg-gray-800 p-5 rounded-xl cursor-pointer hover:bg-gray-700"
        >
          <h2 className="text-lg font-semibold">Total Members</h2>
          <p className="text-3xl mt-2">{members.length}</p>
          <p className="text-xs text-gray-400 mt-1">Click to view</p>
        </div>
      </div>

      {/* CONDITIONAL MEMBERS LIST */}
      {showMembers && (
        <div className="bg-gray-800 p-5 rounded-xl">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">All Members</h2>

            <button
              onClick={() => setShowMembers(false)}
              className="text-red-400"
            >
              Close
            </button>
          </div>

          {members.length === 0 ? (
            <p className="text-gray-400">No members found</p>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="border border-gray-700 p-3 rounded"
                >
                  <p className="font-semibold">{member.user?.name}</p>
                  <p className="text-sm text-gray-400">{member.user?.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
