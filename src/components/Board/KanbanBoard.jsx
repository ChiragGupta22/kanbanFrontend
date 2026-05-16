import React, { useEffect, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";

import {
  getIssues,
  updateIssue,
  createIssue,
} from "../../services/issue.services";

import { Draggable } from "./Dragable";
import { Droppable } from "./Dropable";
import { useAuth } from "../../context/AuthProvider";

const STATUSES = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];

const KanbanBoard = ({ projectId }) => {
  const { user } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({});

  // fetch
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        const data = await getIssues(projectId);

        const normalized = (data || []).map((issue) => ({
          ...issue,
          assignee: issue.assignee || {
            id: user?.id,
            name: user?.name,
          },
        }));

        setIssues(normalized);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId && user) fetch();
  }, [projectId, user]);

  // input
  const handleInput = (status, value) => {
    setInputs((prev) => ({
      ...prev,
      [status]: value,
    }));
  };

  // create
  const handleAdd = async (status) => {
    const title = inputs[status];
    if (!title) return;

    try {
      const newTask = await createIssue({
        title,
        status,
        projectId,
        priority: "MEDIUM",
        assigneeId: user?.id,
      });

      const taskWithUser = {
        ...newTask,
        assignee: {
          id: user?.id,
          name: user?.name,
        },
      };

      setIssues((prev) => [...prev, taskWithUser]);

      setInputs((prev) => ({ ...prev, [status]: "" }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDragEnd = async (event) => {
    const draggedId = event.operation.source?.id;
    const newStatus = event.operation.target?.id;

    if (!draggedId || !newStatus) return;

    setIssues((prev) =>
      prev.map((i) => (i.id === draggedId ? { ...i, status: newStatus } : i)),
    );

    try {
      await updateIssue(draggedId, { status: newStatus });
    } catch (err) {
      console.log(err);
    }
  };

  if (!projectId) return <div className="text-white p-6">Select a project</div>;

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-6 bg-gray-900 min-h-screen overflow-x-auto">
        {STATUSES.map((status) => (
          <Droppable key={status} id={status}>
            <div className="w-[300px] bg-gray-800 rounded-xl flex flex-col">
              {/* HEADER */}
              <div className="p-3 text-white font-bold border-b border-gray-700">
                {status.replaceAll("_", " ")}
              </div>

              {/* CREATE TASK */}
              <div className="p-2">
                <input
                  value={inputs[status] || ""}
                  onChange={(e) => handleInput(status, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd(status)}
                  placeholder="Create task..."
                  className="w-full p-2 bg-gray-700 text-white rounded text-sm"
                />

                <button
                  onClick={() => handleAdd(status)}
                  className="mt-2 w-full bg-blue-600 text-white text-sm py-1 rounded"
                >
                  Add Task
                </button>
              </div>

              {/* CARDS */}
              <div className="p-2 space-y-3 flex-1">
                {issues
                  .filter((i) => i.status === status)
                  .map((i) => (
                    <Draggable key={i.id} id={i.id}>
                      <div className="bg-gray-700 p-3 rounded-lg text-white cursor-move hover:bg-gray-600 transition">
                        <p className="font-semibold text-sm">{i.title}</p>

                        <p className="text-xs text-gray-300 mt-1">
                          {i.project?.name}
                        </p>

                        {/* FIXED USER DISPLAY */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {(i.assignee?.name || user?.name)
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="text-green-400 text-xs">
                            {i.assignee?.name || user?.name}
                          </span>
                        </div>
                      </div>
                    </Draggable>
                  ))}
              </div>
            </div>
          </Droppable>
        ))}
      </div>
    </DragDropProvider>
  );
};

export default KanbanBoard;
