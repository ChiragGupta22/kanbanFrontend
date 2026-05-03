import { useDraggable } from "@dnd-kit/react";

export function Draggable({ id, children }) {
  const { ref } = useDraggable({ id });

  return (
    <div ref={ref} style={{ cursor: "move" }}>
      {children}
    </div>
  );
}
