const Card = ({
  title,
  priority,
  assigneeId,
  members = [],
  onDelete,
  onPriority,
  onUpdate,
  onAssign,
}) => {
  return (
    <div className="bg-gray-800 p-3 rounded-xl text-white">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>

      {/* ASSIGN */}
      <select
        value={assigneeId || ""}
        onChange={(e) => onAssign(e.target.value || null)}
        className="w-full text-xs bg-gray-700 p-1 rounded mb-2"
      >
        <option value="">Assign user</option>

        {members.map((m) => (
          <option key={m.id} value={m.userId}>
            {m.user?.name}
          </option>
        ))}
      </select>

      {/* ACTIONS */}
      <div className="flex justify-between items-center">
        <span
          onClick={onPriority}
          className="text-xs px-2 py-1 rounded cursor-pointer bg-blue-500"
        >
          {priority}
        </span>

        <div className="flex gap-2">
          <button
            onClick={onUpdate}
            className="text-xs bg-blue-600 px-2 rounded"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="text-xs bg-red-600 px-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
