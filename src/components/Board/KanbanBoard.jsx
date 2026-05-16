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

  // ================= FETCH ISSUES =================
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        const data = await getIssues(projectId);
        setIssues(data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetch();
  }, [projectId]);

  // ================= INPUT =================
  const handleInput = (status, value) => {
    setInputs((prev) => ({
      ...prev,
      [status]: value,
    }));
  };

  // ================= CREATE TASK =================
  const handleAdd = async (status) => {
    const title = inputs[status];
    if (!title) return;

    try {
      const newTask = await createIssue({
        title,
        status,
        projectId,
        priority: "MEDIUM",
        assigneeId: user?.id, // 🔥 logged-in user
      });

      setIssues((prev) => [...prev, newTask]);

      setInputs((prev) => ({ ...prev, [status]: "" }));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DRAG & DROP =================
  const handleDragEnd = async (event) => {
    const draggedId = event.operation.source?.id;
    const newStatus = event.operation.target?.id;

    if (!draggedId || !newStatus) return;

    // UI update
    setIssues((prev) =>
      prev.map((i) => (i.id === draggedId ? { ...i, status: newStatus } : i)),
    );

    // DB update
    try {
      await updateIssue(draggedId, { status: newStatus });
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UI STATES =================
  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!projectId) return <div className="text-white p-6">Select a project</div>;

  // ================= UI =================
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

              {/* TASK CARDS */}
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

                        <div className="mt-3 flex items-center gap-2">
                          {i.assignee ? (
                            <>
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                                {i.assignee.name?.charAt(0).toUpperCase()}
                              </div>

                              <span className="text-green-400 text-xs">
                                {i.assignee.name}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              Unassigned
                            </span>
                          )}
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
