"use client"
import { useState } from "react"

export const useBlockSnapping = () => {
  const [draggedBlock, setDraggedBlock] = useState(null)
  const [snapTarget, setSnapTarget] = useState(null)
  const [snapPosition, setSnapPosition] = useState(null)

  const findSnapTarget = (mouseX, mouseY, containerRef) => {
    if (!containerRef.current) return null

    const blocks = containerRef.current.querySelectorAll(".code-block")
    const snapDistance = 20

    for (const block of blocks) {
      const rect = block.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()

      // Check for snap above block
      if (
        mouseX >= rect.left - snapDistance &&
        mouseX <= rect.right + snapDistance &&
        mouseY >= rect.top - snapDistance &&
        mouseY <= rect.top + snapDistance
      ) {
        return {
          element: block,
          position: "above",
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top - 5,
        }
      }

      // Check for snap below block
      if (
        mouseX >= rect.left - snapDistance &&
        mouseX <= rect.right + snapDistance &&
        mouseY >= rect.bottom - snapDistance &&
        mouseY <= rect.bottom + snapDistance
      ) {
        return {
          element: block,
          position: "below",
          x: rect.left - containerRect.left,
          y: rect.bottom - containerRect.top + 5,
        }
      }

      // Check for snap inside C-blocks
      if (block.classList.contains("c-block")) {
        const cContent = block.querySelector(".c-block-content")
        if (cContent) {
          const cRect = cContent.getBoundingClientRect()
          if (
            mouseX >= cRect.left - snapDistance &&
            mouseX <= cRect.right + snapDistance &&
            mouseY >= cRect.top - snapDistance &&
            mouseY <= cRect.bottom + snapDistance
          ) {
            return {
              element: cContent,
              position: "inside",
              x: cRect.left - containerRect.left + 10,
              y: cRect.top - containerRect.top + 10,
            }
          }
        }
      }
    }

    return null
  }

  return {
    draggedBlock,
    setDraggedBlock,
    snapTarget,
    setSnapTarget,
    snapPosition,
    setSnapPosition,
    findSnapTarget,
  }
}

export const SnapIndicator = ({ snapPosition, snapTarget }) => {
  if (!snapPosition || !snapTarget) return null

  return (
    <div
      className="snap-indicator"
      style={{
        position: "absolute",
        left: snapPosition.x,
        top: snapPosition.y,
        width: "100px",
        height: "3px",
        backgroundColor: "#FFD700",
        borderRadius: "2px",
        zIndex: 1000,
        boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
        animation: "pulse 0.5s infinite alternate",
      }}
    />
  )
}
