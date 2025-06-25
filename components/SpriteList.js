"use client"

import React, { useState } from "react"
import PropTypes from "prop-types"
import { Plus, X } from "lucide-react"

const SpriteList = React.memo(({ sprites, selectedId, onSelect, onAdd, onRemove }) => {
  const [showSpriteModal, setShowSpriteModal] = useState(false)

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

  const availableSprites = [
    { name: "Cat", image: "/images/cat.png", description: "Orange cat sprite" },
    { name: "Dog", image: "/images/dog.png", description: "Friendly dog sprite" },
    { name: "Bird", image: "/images/bird.png", description: "Flying bird sprite" },
    { name: "Alien", image: "/images/alien.png", description: "Space alien sprite" },
    { name: "Car", image: "/images/car.png", description: "Racing car sprite" },
    { name: "Ball", image: "/images/ball.png", description: "Bouncing ball sprite" },
  ]

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
        onClick={() => setShowSpriteModal(true)}
        className="add-sprite-button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setShowSpriteModal(true)
          }
        }}
      >
        <Plus size={16} /> Add Sprite
      </button>

      {showSpriteModal && (
        <div className="sprite-modal-overlay" onClick={() => setShowSpriteModal(false)}>
          <div className="sprite-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose a Sprite</h3>
              <button className="close-button" onClick={() => setShowSpriteModal(false)}>
                ×
              </button>
            </div>
            <div className="sprite-options">
              {availableSprites.map((sprite) => (
                <div
                  key={sprite.name}
                  className="sprite-option"
                  onClick={() => {
                    onAdd(sprite.name)
                    setShowSpriteModal(false)
                  }}
                >
                  <div className="sprite-option-image">
                    <img src={sprite.image || "/placeholder.svg"} alt={sprite.name} />
                  </div>
                  <div className="sprite-option-info">
                    <h4>{sprite.name}</h4>
                    <p>{sprite.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sprite-list {
          width: 180px;
          background: linear-gradient(145deg, #f9f9f9, #eeeeee);
          border-left: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 
            inset 2px 0 4px rgba(0,0,0,0.1),
            -2px 0 8px rgba(0,0,0,0.15);
        }
        
        .sprite-list-header {
          padding: 12px 15px;
          background: linear-gradient(145deg, #4C97FF, #3373CC);
          color: white;
          border-bottom: 1px solid #2c5aa0;
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
        }
        
        .sprite-list-header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }
        
        .sprite-list-header h4 {
          margin: 0;
          font-size: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          font-weight: 600;
        }
        
        .sprites-container {
          flex: 1;
          padding: 12px 10px;
          overflow-y: auto;
          background: linear-gradient(145deg, #ffffff, #f8f9fa);
        }
        
        .sprite-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          margin-bottom: 8px;
          cursor: pointer;
          border-radius: 10px;
          background: linear-gradient(145deg, #ffffff, #f5f5f5);
          border: 1px solid #e0e0e0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          transform-style: preserve-3d;
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .sprite-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.05));
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .sprite-item:hover::before {
          opacity: 1;
        }

        .sprite-item:hover {
          transform: translateY(-2px) rotateX(5deg);
          box-shadow: 
            0 6px 12px rgba(0,0,0,0.15),
            0 2px 4px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }
        
        .sprite-item.active {
          background: linear-gradient(145deg, #e3f2fd, #bbdefb);
          border-color: #2196f3;
          box-shadow: 
            0 4px 8px rgba(33, 150, 243, 0.3),
            0 2px 4px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transform: translateY(-1px);
        }
        
        .sprite-thumbnail {
          width: 36px;
          height: 36px;
          margin-right: 12px;
          border-radius: 8px;
          overflow: hidden;
          background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 0 1px 2px rgba(0,0,0,0.1),
            0 1px 0 rgba(255,255,255,0.8);
        }
        
        .sprite-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #64B5F6, #42A5F5);
          color: white;
          font-weight: bold;
          font-size: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        .sprite-name {
          flex: 1;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 600;
          color: #333;
          text-shadow: 0 1px 0 rgba(255,255,255,0.8);
        }
        
        .remove-button {
          background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9));
          border: 1px solid rgba(0,0,0,0.1);
          color: #999;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: all 0.3s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .sprite-item:hover .remove-button {
          opacity: 1;
        }
        
        .remove-button:hover {
          background: linear-gradient(145deg, #ffebee, #ffcdd2);
          color: #f44336;
          border-color: #f44336;
          transform: scale(1.1);
          box-shadow: 0 2px 4px rgba(244, 67, 54, 0.3);
        }
        
        .add-sprite-button {
          margin: 12px 10px;
          padding: 12px 16px;
          background: linear-gradient(145deg, #4CAF50, #43A047);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 4px 8px rgba(76, 175, 80, 0.3),
            inset 0 1px 0 rgba(255,255,255,0.2);
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        .add-sprite-button:hover {
          background: linear-gradient(145deg, #43A047, #388E3C);
          transform: translateY(-2px);
          box-shadow: 
            0 6px 12px rgba(76, 175, 80, 0.4),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .sprite-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .sprite-modal {
          background: linear-gradient(145deg, #ffffff, #f8f9fa);
          border-radius: 16px;
          padding: 0;
          max-width: 520px;
          max-height: 620px;
          overflow: hidden;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 10px 20px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255,255,255,0.8);
          transform: scale(0.9);
          animation: modalAppear 0.3s ease-out forwards;
        }

        @keyframes modalAppear {
          to {
            transform: scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #eee;
          background: linear-gradient(145deg, #f8f9fa, #e9ecef);
          box-shadow: inset 0 -1px 0 rgba(255,255,255,0.8);
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
          font-size: 20px;
          font-weight: 600;
          text-shadow: 0 1px 0 rgba(255,255,255,0.8);
        }

        .close-button {
          background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9));
          border: 1px solid rgba(0,0,0,0.1);
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .close-button:hover {
          background: linear-gradient(145deg, #ffebee, #ffcdd2);
          color: #f44336;
          border-color: #f44336;
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(244, 67, 54, 0.3);
        }

        .sprite-options {
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          max-height: 420px;
          overflow-y: auto;
          background: linear-gradient(145deg, #ffffff, #f8f9fa);
        }

        .sprite-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          background: linear-gradient(145deg, #ffffff, #f5f5f5);
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .sprite-option:hover {
          border-color: #4C97FF;
          background: linear-gradient(145deg, #f0f8ff, #e3f2fd);
          transform: translateY(-4px) rotateX(5deg);
          box-shadow: 
            0 8px 16px rgba(76, 151, 255, 0.2),
            0 4px 8px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .sprite-option-image {
          width: 64px;
          height: 64px;
          margin-bottom: 12px;
          border-radius: 10px;
          overflow: hidden;
          background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset 0 2px 4px rgba(0,0,0,0.1),
            0 1px 0 rgba(255,255,255,0.8);
        }

        .sprite-option-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .sprite-option-info h4 {
          margin: 0 0 6px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          text-shadow: 0 1px 0 rgba(255,255,255,0.8);
        }

        .sprite-option-info p {
          margin: 0;
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }

        /* Custom scrollbar for 3D effect */
        .sprites-container::-webkit-scrollbar,
        .sprite-options::-webkit-scrollbar {
          width: 8px;
        }

        .sprites-container::-webkit-scrollbar-track,
        .sprite-options::-webkit-scrollbar-track {
          background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
          border-radius: 4px;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }

        .sprites-container::-webkit-scrollbar-thumb,
        .sprite-options::-webkit-scrollbar-thumb {
          background: linear-gradient(145deg, #c0c0c0, #a0a0a0);
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .sprites-container::-webkit-scrollbar-thumb:hover,
        .sprite-options::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(145deg, #b0b0b0, #909090);
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
