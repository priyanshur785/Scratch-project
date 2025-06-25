"use client"

import React from "react"

const Stage = ({ sprites, selectedId }) => {
  if (!sprites || sprites.length === 0) {
    return (
      <div className="stage-empty">
        <p>No sprites available</p>
      </div>
    )
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const idRaw = e.dataTransfer.getData("sprite-id")
    const id = isNaN(idRaw) ? idRaw : Number.parseInt(idRaw, 10)
    const rect = e.currentTarget.getBoundingClientRect()
    const newX = e.clientX - rect.left - 50 // Centering sprite
    const newY = e.clientY - rect.top - 50

    const updateEvent = new CustomEvent("update-sprite-position", {
      detail: { id, x: newX, y: newY },
    })
    window.dispatchEvent(updateEvent)
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
    <div
      className="stage"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      aria-label="Stage area with sprites"
      tabIndex={0}
    >
      <div className="stage-header">
        <h3>Stage</h3>
      </div>

      <div className="stage-content">
        {sprites.map((sprite) => {
          const { id, name, x = 50, y = 100, rotation = 0, speech = "", output = "", size = 100 } = sprite

          const isActive = id === selectedId
          const spriteImage = getSpriteImage(name)

          // Apply special rotation for dog to make it upright
          const adjustedRotation = name.toLowerCase().includes("dog") ? rotation - 90 : rotation

          return (
            <React.Fragment key={id}>
              <div
                role="button"
                aria-pressed={isActive}
                tabIndex={0}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("sprite-id", id)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                  }
                }}
                className={`sprite ${isActive ? "active" : ""}`}
                style={{
                  width: size,
                  height: size,
                  left: x,
                  top: y,
                  transform: `rotate(${adjustedRotation}deg)`,
                }}
                title={name}
              >
                {spriteImage ? (
                  <img
                    src={spriteImage || "/placeholder.svg"}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      pointerEvents: "none",
                    }}
                  />
                ) : (
                  <div className="sprite-fallback">{name}</div>
                )}
              </div>

              {speech && (
                <div className="speech-bubble" style={{ top: y - 40, left: x + size + 10 }}>
                  {speech}
                </div>
              )}

              {output && (
                <div className="output-text" style={{ top: y + size + 10, left: x }}>
                  <b>{name}:</b> {output}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      <style jsx>{`
        .stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: white;
          position: relative;
          overflow: hidden;
          user-select: none;
          border-right: 1px solid #ddd;
        }
        
        .stage-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9f9f9;
          color: #666;
        }
        
        .stage-header {
          padding: 10px 15px;
          background-color: #4C97FF;
          color: white;
          border-bottom: 1px solid #3373CC;
        }
        
        .stage-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .stage-content {
          flex: 1;
          background-color: #fff9c4;
          position: relative;
        }
        
        .sprite {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          transition: transform 0.3s ease;
          border-radius: 4px;
          outline: none;
        }
        
        .sprite.active {
          box-shadow: 0 0 0 3px #FF4081;
          z-index: 10;
        }
        
        .sprite:active {
          cursor: grabbing;
        }
        
        .sprite-fallback {
          width: 100%;
          height: 100%;
          background-color: #64B5F6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .speech-bubble {
          position: absolute;
          background-color: white;
          padding: 8px 12px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          max-width: 200px;
          z-index: 5;
          font-style: italic;
        }
        
        .speech-bubble:after {
          content: '';
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 10px 10px 10px 0;
          border-style: solid;
          border-color: transparent white transparent transparent;
        }
        
        .output-text {
          position: absolute;
          font-style: italic;
          color: #333;
          font-size: 12px;
          z-index: 2;
          background-color: rgba(255, 255, 255, 0.7);
          padding: 2px 6px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

export default Stage
