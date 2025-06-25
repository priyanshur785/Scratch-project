"use client"

import React from "react"
import PropTypes from "prop-types"
import { Plus, X } from "lucide-react"

const SpriteList = React.memo(({ sprites, selectedId, onSelect, onAdd, onRemove }) => {
  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelect(id)
    }
  }

  // Helper function to get sprite image based on name
  const getSpriteImage = (name) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("cat")) return "/images/cat.png"
    if (lowerName.includes("dog")) return "/images/dog.png"
    if (lowerName.includes("bird")) return "/images/bird.png"
    if (lowerName.includes("alien")) return "/images/alien.png"
    if (lowerName.includes("car")) return "/images/car.png"
    if (lowerName.includes("ball")) return "/images/ball.png"
    return null
  }

  return (
    <div className="sprite-list">
      <div className="sprite-list-header">
        <h4>Sprites</h4>
      </div>

      <div className="sprites-container">
        {sprites.map((sprite) => {
          const spriteImage = getSpriteImage(sprite.name)

          return (
            <div
              key={sprite.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect && onSelect(sprite.id)}
              onKeyDown={(e) => handleKeyDown(e, sprite.id)}
              className={`sprite-item ${sprite.id === selectedId ? "active" : ""}`}
              aria-pressed={sprite.id === selectedId}
            >
              <div className="sprite-thumbnail">
                {spriteImage ? (
                  <img
                    src={spriteImage || "/placeholder.svg"}
                    alt={sprite.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <div className="sprite-fallback">{sprite.name.charAt(0)}</div>
                )}
              </div>

              <span className="sprite-name">{sprite.name}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(sprite.id)
                }}
                className="remove-button"
                aria-label={`Remove ${sprite.name}`}
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>

      <button
        onClick={onAdd}
        className="add-sprite-button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onAdd()
          }
        }}
      >
        <Plus size={16} /> Add Sprite
      </button>

      <style jsx>{`
        .sprite-list {
          width: 180px;
          background-color: #f9f9f9;
          border-left: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .sprite-list-header {
          padding: 10px 15px;
          background-color: #4C97FF;
          color: white;
          border-bottom: 1px solid #3373CC;
        }
        
        .sprite-list-header h4 {
          margin: 0;
          font-size: 16px;
        }
        
        .sprites-container {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
        }
        
        .sprite-item {
          display: flex;
          align-items: center;
          padding: 8px 10px;
          margin-bottom: 6px;
          cursor: pointer;
          border-radius: 4px;
          background-color: white;
          border: 1px solid #ddd;
          transition: all 0.2s;
          position: relative;
        }
        
        .sprite-item.active {
          background-color: #e3f2fd;
          border-color: #2196f3;
        }
        
        .sprite-thumbnail {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .sprite-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #64B5F6;
          color: white;
          font-weight: bold;
        }
        
        .sprite-name {
          flex: 1;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .remove-button {
          background-color: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 2px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
          transition: all 0.2s;
        }
        
        .sprite-item:hover .remove-button {
          opacity: 1;
        }
        
        .remove-button:hover {
          background-color: #ffebee;
          color: #f44336;
        }
        
        .add-sprite-button {
          margin: 10px;
          padding: 10px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background-color 0.3s;
        }
        
        .add-sprite-button:hover {
          background-color: #43A047;
        }
      `}</style>
    </div>
  )
})

SpriteList.propTypes = {
  sprites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
    }),
  ).isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

SpriteList.defaultProps = {
  selectedId: null,
}

export default SpriteList
