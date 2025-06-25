"use client"

import React, { useState, useEffect } from "react"
import { Flag, Square, Maximize2, Monitor, Eye, EyeOff, Minimize2 } from "lucide-react"

const Stage = ({ sprites, selectedId, onRunSprite, onStopAll, onSelectSprite, isRunning }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [spriteVisibility, setSpriteVisibility] = useState({})
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!sprites || sprites.length === 0) {
    return (
      <div className="stage-container">
        <div className="stage-header">
          <div className="stage-controls">
            <button className="control-btn green-flag">
              <Flag size={16} />
            </button>
            <button className="control-btn stop-btn">
              <Square size={12} />
            </button>
          </div>
          <div className="stage-actions">
            <button className="action-btn">
              <Monitor size={16} />
            </button>
            <button className="action-btn">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
        <div className="stage-area">
          <p>No sprites available</p>
        </div>
      </div>
    )
  }

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

  const activeSprite = sprites.find((sprite) => sprite.id === selectedId)

  const handleRunSelectedSprite = () => {
    if (selectedId && onRunSprite) {
      onRunSprite(selectedId)
    }
  }

  const handleStopAll = () => {
    if (onStopAll) {
      onStopAll()
    }
  }

  const toggleSpriteVisibility = (spriteId) => {
    setSpriteVisibility((prev) => ({
      ...prev,
      [spriteId]: !prev[spriteId],
    }))
  }

  const isSpriteVisible = (spriteId) => {
    return spriteVisibility[spriteId] !== false // Default to visible
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleSpriteClick = (spriteId) => {
    if (onSelectSprite) {
      onSelectSprite(spriteId)
    }
  }

  // Don't render dynamic content until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="stage-container">
        <div className="stage-header">
          <div className="stage-controls">
            <button className="control-btn green-flag">
              <Flag size={16} />
            </button>
            <button className="control-btn stop-btn">
              <Square size={12} />
            </button>
          </div>
          <div className="stage-actions">
            <button className="action-btn">
              <Monitor size={16} />
            </button>
            <button className="action-btn">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
        <div className="stage-area">
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`stage-container ${isFullscreen ? "fullscreen" : ""}`}>
      {/* Stage Header with Controls */}
      <div className="stage-header">
        <div className="stage-controls">
          <button
            className={`control-btn green-flag ${isRunning ? "running" : ""}`}
            onClick={handleRunSelectedSprite}
            disabled={isRunning || !selectedId}
            title={`Start ${activeSprite?.name || "selected sprite"} (Green Flag)`}
          >
            <Flag size={16} />
          </button>
          <button
            className="control-btn stop-btn"
            onClick={handleStopAll}
            title="Stop all sprites"
            disabled={!isRunning}
          >
            <Square size={12} />
          </button>
        </div>
        <div className="stage-actions">
          <button className="action-btn" title="Presentation Mode">
            <Monitor size={16} />
          </button>
          <button
            className="action-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Stage Area */}
      <div className="stage-area" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {sprites.map((sprite) => {
          const { id, name, x = 240, y = 180, rotation = 0, speech = "", output = "", size = 100 } = sprite
          const isActive = id === selectedId
          const spriteImage = getSpriteImage(name)
          const visible = isSpriteVisible(id)

          // Center coordinates (240, 180 is center of 480x360 stage)
          const stageX = x
          const stageY = y

          if (!visible) return null

          return (
            <React.Fragment key={id}>
              <div
                className={`sprite ${isActive ? "active" : ""} ${isRunning ? "running" : ""}`}
                style={{
                  width: size,
                  height: size,
                  left: stageX - size / 2,
                  top: stageY - size / 2,
                  transform: `rotate(${rotation}deg)`,
                }}
                draggable={!isRunning}
                onDragStart={(e) => {
                  if (!isRunning) {
                    e.dataTransfer.setData("sprite-id", id)
                  }
                }}
                onClick={() => handleSpriteClick(id)}
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
                  className="speech-bubble"
                  style={{
                    top: stageY - size / 2 - 50,
                    left: stageX + size / 2 + 10,
                  }}
                >
                  {speech}
                </div>
              )}
            </React.Fragment>
          )
        })}

        {/* Running indicator */}
        {isRunning && (
          <div className="running-indicator">
            <div className="running-text">Running {activeSprite?.name}...</div>
          </div>
        )}
      </div>

      {/* Sprite Info Panel */}
      <div className="sprite-info-panel">
        <div className="sprite-info-left">
          <div className="sprite-selector">
            <span className="sprite-label">Sprite</span>
            <select
              className="sprite-dropdown"
              value={selectedId || ""}
              onChange={(e) => handleSpriteClick(Number(e.target.value))}
            >
              {sprites.map((sprite) => (
                <option key={sprite.id} value={sprite.id}>
                  {sprite.name}
                </option>
              ))}
            </select>
          </div>

          <div className="coordinate-display">
            <div className="coord-group">
              <span className="coord-icon">↔</span>
              <span className="coord-label">x</span>
              <span className="coord-value">{Math.round(activeSprite?.x || 0)}</span>
            </div>
            <div className="coord-group">
              <span className="coord-icon">↕</span>
              <span className="coord-label">y</span>
              <span className="coord-value">{Math.round(activeSprite?.y || 0)}</span>
            </div>
          </div>

          <div className="sprite-properties">
            <div className="property-group">
              <span className="property-label">Show</span>
              <button
                className={`visibility-btn ${isSpriteVisible(selectedId) ? "active" : ""}`}
                onClick={() => toggleSpriteVisibility(selectedId)}
                title="Show sprite"
              >
                <Eye size={14} />
              </button>
              <button
                className={`visibility-btn ${!isSpriteVisible(selectedId) ? "active" : ""}`}
                onClick={() => toggleSpriteVisibility(selectedId)}
                title="Hide sprite"
              >
                <EyeOff size={14} />
              </button>
            </div>
            <div className="property-group">
              <span className="property-label">Size</span>
              <span className="property-value">{activeSprite?.size || 100}</span>
            </div>
            <div className="property-group">
              <span className="property-label">Direction</span>
              <span className="property-value">{activeSprite?.rotation || 90}</span>
            </div>
          </div>

          {/* Sprite Thumbnail */}
          <div className="sprite-thumbnail-container">
            {activeSprite && (
              <div className="sprite-thumbnail-card">
                <div className="sprite-thumbnail">
                  {getSpriteImage(activeSprite.name) ? (
                    <img src={getSpriteImage(activeSprite.name) || "/placeholder.svg"} alt={activeSprite.name} />
                  ) : (
                    <div className="sprite-fallback-thumb">{activeSprite.name.charAt(0)}</div>
                  )}
                </div>
                <span className="sprite-name">{activeSprite.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="stage-info-panel">
          <div className="stage-info-header">
            <span className="stage-label">Stage</span>
          </div>
          <div className="backdrop-info">
            <span className="backdrop-label">Backdrops</span>
            <span className="backdrop-count">1</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stage-container {
          width: 480px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #d9d9d9;
          transition: all 0.3s ease;
        }

        .stage-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          border-radius: 0;
        }

        .fullscreen .stage-area {
          width: 100vw;
          height: calc(100vh - 120px);
        }

        .stage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          background: linear-gradient(145deg, #4C97FF, #3373CC);
          color: white;
          border-bottom: 1px solid #2c5aa0;
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
        }

        .stage-header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }

        .stage-controls {
          display: flex;
          gap: 8px;
        }

        .control-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .green-flag {
          background: #4CBB17;
          color: white;
        }

        .green-flag:hover:not(:disabled) {
          background: #45A015;
          transform: scale(1.05);
        }

        .green-flag:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #ccc;
        }

        .green-flag.running {
          background: #45A015;
          animation: pulse 1s infinite;
        }

        .stop-btn {
          background: #FF4757;
          color: white;
        }

        .stop-btn:hover:not(:disabled) {
          background: #E63946;
          transform: scale(1.05);
        }

        .stop-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #ccc;
        }

        .stage-actions {
          display: flex;
          gap: 4px;
        }

        .action-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #d9d9d9;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #666;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f5f5f5;
          transform: scale(1.05);
        }

        .stage-area {
          width: 480px;
          height: 360px;
          background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
          position: relative;
          overflow: hidden;
        }

        .running-indicator {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(76, 187, 23, 0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          z-index: 100;
          animation: pulse 1s infinite;
        }

        .sprite {
          position: absolute;
          cursor: grab;
          transition: transform 0.3s ease;
          z-index: 10;
          border-radius: 4px;
        }

        .sprite.active {
          z-index: 20;
          box-shadow: 0 0 0 2px #4C97FF;
        }

        .sprite:active {
          cursor: grabbing;
        }

        .sprite.running {
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
          border: 2px solid #4C97FF;
          word-wrap: break-word;
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

        .sprite-info-panel {
          display: flex;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
          padding: 12px;
          gap: 16px;
        }

        .sprite-info-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sprite-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sprite-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .sprite-dropdown {
          padding: 4px 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          background: white;
          font-size: 14px;
          cursor: pointer;
        }

        .coordinate-display {
          display: flex;
          gap: 16px;
        }

        .coord-group {
          display: flex;
          align-items: center;
          gap: 4px;
          background: white;
          padding: 4px 8px;
          border-radius: 16px;
          border: 1px solid #d9d9d9;
        }

        .coord-icon {
          font-size: 12px;
          color: #666;
        }

        .coord-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .coord-value {
          font-size: 12px;
          color: #333;
          font-weight: 600;
          min-width: 20px;
          text-align: center;
        }

        .sprite-properties {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .property-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .property-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .property-value {
          font-size: 12px;
          color: #333;
          font-weight: 600;
        }

        .visibility-btn {
          width: 24px;
          height: 24px;
          border: 1px solid #d9d9d9;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ccc;
          transition: all 0.2s;
        }

        .visibility-btn.active {
          color: #4C97FF;
          border-color: #4C97FF;
          background: #f0f8ff;
        }

        .visibility-btn:hover {
          transform: scale(1.05);
        }

        .sprite-thumbnail-container {
          margin-top: 8px;
        }

        .sprite-thumbnail-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #9966FF;
          padding: 8px;
          border-radius: 8px;
          width: 60px;
        }

        .sprite-thumbnail {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .sprite-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .sprite-fallback-thumb {
          color: #4C97FF;
          font-weight: bold;
          font-size: 16px;
        }

        .sprite-name {
          color: white;
          font-size: 10px;
          font-weight: 500;
          text-align: center;
        }

        .stage-info-panel {
          width: 80px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stage-info-header {
          text-align: center;
        }

        .stage-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .backdrop-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .backdrop-label {
          font-size: 12px;
          color: #666;
        }

        .backdrop-count {
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

export default Stage
