import React, { useEffect, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useParams } from "react-router-dom";
import { useRef } from "react";

import {
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
} from "../../services/issue.services";

import API from "../../services/auth.services";
import Card from "./Card";
import { Draggable } from "./Dragable";
import { Droppable } from "./Dropable";

function Board() {
  const { projectId } = useParams();

  const [issues, setIssues] = useState([]);
  const [members, setMembers] = useState([]);
  const [inputs, setInputs] = useState({});

  const STATUSES = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];

  const fetchIssues = async () => {
    try {
      const data = await getIssues(projectId);
      setIssues(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await API.get(`/member?projectId=${projectId}`);
      setMembers(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchIssues();
      fetchMembers();
    }
  }, [projectId]);

  const handleInput = (status, value) => {
    setInputs((prev) => ({ ...prev, [status]: value }));
  };

  const handleAdd = async (status) => {
    const title = inputs[status];
    if (!title) return;

    await createIssue({
      title,
      status,
      priority: "MEDIUM",
      projectId,
    });

    setInputs((prev) => ({ ...prev, [status]: "" }));
    fetchIssues();
  };

  const handleDelete = async (id) => {
    await deleteIssue(id);
    setIssues((prev) => prev.filter((i) => i.id !== id));
  };

  const handlePriority = async (id, current) => {
    const newPriority = prompt("LOW / MEDIUM / HIGH", current);
    if (!newPriority) return;

    await updateIssue(id, { priority: newPriority });
    fetchIssues();
  };

  const handleUpdate = async (id, oldTitle) => {
    const newTitle = prompt("Update title", oldTitle);
    if (!newTitle) return;

    const issue = issues.find((i) => i.id === id);

    await updateIssue(id, {
      title: newTitle,
      assigneeId: issue.assigneeId,
    });

    fetchIssues();
  };

  // ---------------- ASSIGN USER ----------------
  const handleAssign = async (issueId, userId) => {
    try {
      await updateIssue(issueId, {
        assigneeId: userId || null,
      });

      setIssues((prev) =>
        prev.map((i) =>
          i.id === issueId ? { ...i, assigneeId: userId || null } : i,
        ),
      );
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <DragDropProvider
      onDragEnd={async (event) => {
        const draggedId = event.operation.source?.id;
        const newStatus = event.operation.target?.id;

        if (!draggedId || !newStatus) return;

        setIssues((prev) =>
          prev.map((i) =>
            i.id === draggedId ? { ...i, status: newStatus } : i,
          ),
        );

        await updateIssue(draggedId, { status: newStatus });
      }}
    >
      <div className="flex gap-6 p-6 bg-gray-900 min-h-screen">
        {STATUSES.map((status) => (
          <div key={status} className="w-[300px] bg-gray-800 rounded-xl">
            <Droppable id={status}>
              <div className="p-3 text-white font-bold border-b border-gray-700">
                {status}
              </div>

              {/* INPUT */}
              <div className="p-2">
                <input
                  value={inputs[status] || ""}
                  onChange={(e) => handleInput(status, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd(status)}
                  placeholder="Add task..."
                  className="w-full p-2 bg-gray-700 text-white rounded text-sm"
                />
              </div>

              {/* CARDS */}
              <div className="p-2 space-y-3">
                {issues
                  .filter((i) => i.status === status)
                  .map((i) => (
                    <Draggable key={i.id} id={i.id}>
                      <Card
                        title={i.title}
                        priority={i.priority}
                        assigneeId={i.assigneeId}
                        members={members}
                        onDelete={() => handleDelete(i.id)}
                        onPriority={() => handlePriority(i.id, i.priority)}
                        onUpdate={() => handleUpdate(i.id, i.title)}
                        onAssign={(userId) => handleAssign(i.id, userId)}
                      />

                      {/* SHOW ASSIGNEE */}
                      {i.assignee?.name && (
                        <p className="text-xs text-green-400 mt-1">
                          Assigned: {i.assignee.name}
                        </p>
                      )}
                    </Draggable>
                  ))}
              </div>
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropProvider>
  );
}

export default Board;
