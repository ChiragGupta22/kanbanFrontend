import { useDroppable } from "@dnd-kit/react";

export function Droppable({ id, children }) {
  const { ref } = useDroppable({ id });

  return (
    <div
      ref={ref}
      style={{ minHeight: "400px" }}
      className="w-[311px] flex flex-col"
    >
      {children}
    </div>
  );
}
