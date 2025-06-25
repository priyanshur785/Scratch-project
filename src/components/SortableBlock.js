"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export const SortableBlock = ({ id, block, onChangeValue, onDelete, isActive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    marginBottom: "8px",
    backgroundColor: isActive ? "#ffd" : "#fff",
    border: "1px solid #ccc",
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div>
        <strong>{block.type}</strong>
      </div>
      <input
        type="text"
        placeholder="Value"
        value={block.value || ""}
        onChange={(e) => onChangeValue(block.id, e.target.value)}
        style={{ width: "100%", marginTop: "5px" }}
      />
      <button
        onClick={() => onDelete(block.id)}
        style={{ marginTop: "5px", backgroundColor: "#f44336", color: "#fff" }}
      >
        Delete
      </button>
    </div>
  )
}
