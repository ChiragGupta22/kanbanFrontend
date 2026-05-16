import React, { useEffect, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { getIssues, updateIssue } from "../../services/issue.services";
import { Draggable } from "./Dragable";
import { Droppable } from "./Dropable";
import { useParams } from "react-router-dom";

const STATUSES = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];

const KanbanBoard = ({ projectId }) => {
  const params = useParams();

  // ✅ refresh ke baad URL se projectId aa jayega
  const finalProjectId = projectId || params.projectId;

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        const res = await getIssues();
        const allIssues = res || [];

        const filtered = finalProjectId
          ? allIssues.filter((i) => i.projectId === finalProjectId)
          : [];

        setIssues(filtered);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [finalProjectId]);

  const handleDragEnd = async (event) => {
    const draggedId = event.operation.source?.id;
    const newStatus = event.operation.target?.id;

    if (!draggedId || !newStatus) return;

    // UI update instantly
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

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (!finalProjectId) {
    return <div className="text-white p-6">Select a project</div>;
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-6 bg-gray-900 min-h-screen overflow-x-auto">
        {STATUSES.map((status) => (
          <Droppable key={status} id={status}>
            <div className="w-[300px] bg-gray-800 rounded-xl flex flex-col">
              {/* COLUMN HEADER */}
              <div className="p-3 text-white font-bold border-b border-gray-700">
                {status.replaceAll("_", " ")}
              </div>

              {/* CARDS */}
              <div className="p-2 space-y-3 flex-1">
                {issues
                  .filter((i) => i.status === status)
                  .map((i) => (
                    <Draggable key={i.id} id={i.id}>
                      <div className="bg-gray-700 p-3 rounded-lg text-white cursor-move hover:bg-gray-600 transition">
                        {/* TITLE */}
                        <p className="font-semibold text-sm">{i.title}</p>

                        {/* PROJECT */}
                        <p className="text-xs text-gray-300 mt-1">
                          {i.project?.name}
                        </p>

                        {/* ASSIGNEE */}
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
