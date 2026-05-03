import React from "react";

const Card = ({ title, priority }) => {
  return (
    <div className="bg-gray-700 p-3 rounded text-white">
      <h2 className="text-sm mb-2">{title}</h2>

      <span className="text-xs bg-orange-400 px-2 py-1 rounded text-black">
        {priority}
      </span>
    </div>
  );
};

export default Card;
