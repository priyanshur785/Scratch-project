"use client"
import React, { useState } from "react"
import { Square, Flag, Maximize2 } from "lucide-react"
import { VariableDisplay } from "./VariableManager"

const StageArea = ({ sprites, selectedId, onRunFlag, onStopAll, variables = [], isRunning }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    const idRaw = e.dataTransfer.getData("sprite-id")
    const id = isNaN(idRaw) ? idRaw : Number.parseInt(idRaw, 10)
    const rect = e.currentTarget.getBoundingClientRect()
    const newX = e.clientX - rect.left - 50
    const newY = e.clientY - rect.top - 50

    const updateEvent = new CustomEvent("update-sprite-position", {
      detail: { id, x: newX, y: newY },
    })
    window.dispatchEvent(updateEvent)
  }

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

  const handleGreenFlag = async () => {
    await onRunFlag()
  }

  const handleStop = () => {
    onStopAll && onStopAll()
  }

  // Get selected sprite name for flag button
  const selectedSprite = sprites.find((s) => s.id === selectedId)
  const flagText = selectedSprite ? `Flag (${selectedSprite.name})` : "Flag (Select Sprite)"

  return (
    <div className="stage-area">
      <div className="stage-header">
        <div className="stage-controls">
          <button
            className={`green-flag ${isRunning ? "running" : ""}`}
            onClick={handleGreenFlag}
            title={flagText}
            disabled={isRunning || !selectedId}
          >
            <Flag size={20} />
          </button>
          <button className="stop-button" onClick={handleStop} title="Stop all sprites">
            <Square size={16} />
          </button>
        </div>

        <div className="stage-info">
          <span>Stage</span>
          {isRunning && <span className="running-indicator">Running...</span>}
        </div>

        <div className="stage-actions">
          <button className="fullscreen-button" onClick={() => setIsFullscreen(!isFullscreen)} title="Full screen">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div
        className={`stage-canvas ${isFullscreen ? "fullscreen" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="stage-content">
          <VariableDisplay variables={variables} sprites={sprites} />

          {sprites &&
            sprites.map((sprite) => {
              const { id, name, x = 50, y = 100, rotation = 0, speech = "", size = 100, visible = true } = sprite
              const isActive = id === selectedId
              const spriteImage = getSpriteImage(name)
              const adjustedRotation = name.toLowerCase().includes("dog") ? rotation - 90 : rotation

              if (!visible) return null

              return (
                <React.Fragment key={id}>
                  <div
                    className={`stage-sprite ${isActive ? "active" : ""} ${isRunning ? "running" : ""}`}
                    style={{
                      width: size,
                      height: size,
                      left: x,
                      top: y,
                      transform: `rotate(${adjustedRotation}deg)`,
                    }}
                    draggable={!isRunning}
                    onDragStart={(e) => {
                      if (!isRunning) {
                        e.dataTransfer.setData("sprite-id", id)
                      }
                    }}
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
                    <div
                      className={`speech-bubble ${speech.startsWith("💭") ? "thought" : ""}`}
                      style={{
                        top: Math.max(10, y - 50),
                        left: Math.min(350, x + size + 10),
                      }}
                    >
                      {speech.replace("💭 ", "")}
                    </div>
                  )}
                </React.Fragment>
              )
            })}
        </div>

        <div className="stage-coordinates">
          <span>x: 0 y: 0</span>
        </div>
      </div>

      <style jsx>{`
        .stage-area {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .stage-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #E9EEF2;
          border-bottom: 1px solid #D9D9D9;
        }
        
        .stage-controls {
          display: flex;
          gap: 8px;
        }
        
        .green-flag {
          background: #4CBB17;
          border: none;
          border-radius: 4px;
          color: white;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .green-flag:hover:not(:disabled) {
          background: #45A015;
          transform: scale(1.05);
        }
        
        .green-flag:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .green-flag.running {
          background: #45A015;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .stop-button {
          background: #FF4757;
          border: none;
          border-radius: 4px;
          color: white;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .stop-button:hover {
          background: #E63946;
          transform: scale(1.05);
        }
        
        .stage-info {
          font-weight: 600;
          color: #575E75;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .running-indicator {
          background: #4CBB17;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          animation: pulse 1s infinite;
        }
        
        .stage-actions {
          display: flex;
          gap: 8px;
        }
        
        .fullscreen-button {
          background: none;
          border: 1px solid #D9D9D9;
          border-radius: 4px;
          color: #575E75;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .fullscreen-button:hover {
          background: #F2F2F2;
          border-color: #CCCCCC;
        }
        
        .stage-canvas {
          width: 480px;
          height: 360px;
          background: white;
          position: relative;
          overflow: hidden;
        }
        
        .stage-canvas.fullscreen {
          width: 100vw;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
        }
        
        .stage-content {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
          position: relative;
        }
        
        .stage-sprite {
          position: absolute;
          cursor: grab;
          transition: transform 0.3s ease;
          border-radius: 4px;
        }
        
        .stage-sprite:active {
          cursor: grabbing;
        }
        
        .stage-sprite.active {
          box-shadow: 0 0 0 3px #FF6B35;
          z-index: 10;
        }
        
        .stage-sprite.running {
          cursor: default;
        }
        
        .sprite-fallback {
          width: 100%;
          height: 100%;
          background: #4C97FF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .speech-bubble {
          position: absolute;
          background: white;
          padding: 8px 12px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          max-width: 200px;
          z-index: 15;
          font-size: 14px;
          border: 2px solid #4C97FF;
          word-wrap: break-word;
        }
        
        .speech-bubble.thought {
          border-radius: 20px;
          border-color: #9966FF;
        }
        
        .speech-bubble:after {
          content: '';
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 8px 8px 8px 0;
          border-style: solid;
          border-color: transparent white transparent transparent;
        }
        
        .speech-bubble:before {
          content: '';
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 9px 9px 9px 0;
          border-style: solid;
          border-color: transparent #4C97FF transparent transparent;
        }
        
        .speech-bubble.thought:before {
          border-color: transparent #9966FF transparent transparent;
        }
        
        .stage-coordinates {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-family: monospace;
        }
      `}</style>
    </div>
  )
}

export default StageArea
