"use client"
import { Search, Upload, Paintbrush, SmileIcon as Surprise, X } from "lucide-react"

const SpritePanel = ({ sprites, selectedId, onSelect, onAdd, onRemove }) => {
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
    <div className="sprite-panel">
      <div className="panel-header">
        <h3>Sprites</h3>
        <div className="sprite-count">{sprites.length}</div>
      </div>

      <div className="sprites-grid">
        {sprites.map((sprite) => {
          const spriteImage = getSpriteImage(sprite.name)
          const isSelected = sprite.id === selectedId

          return (
            <div
              key={sprite.id}
              className={`sprite-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(sprite.id)}
            >
              <div className="sprite-thumbnail">
                {spriteImage ? (
                  <img src={spriteImage || "/placeholder.svg"} alt={sprite.name} className="sprite-image" />
                ) : (
                  <div className="sprite-fallback">{sprite.name.charAt(0)}</div>
                )}

                <button
                  className="delete-sprite"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(sprite.id)
                  }}
                  title="Delete sprite"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="sprite-name">{sprite.name}</div>
            </div>
          )
        })}

        <div className="add-sprite-options">
          <button className="add-sprite-btn" onClick={onAdd} title="Choose a Sprite">
            <div className="add-icon">
              <Search size={20} />
            </div>
            <span>Choose a Sprite</span>
          </button>

          <button className="add-sprite-btn" title="Paint">
            <div className="add-icon">
              <Paintbrush size={20} />
            </div>
            <span>Paint</span>
          </button>

          <button className="add-sprite-btn" title="Surprise">
            <div className="add-icon">
              <Surprise size={20} />
            </div>
            <span>Surprise</span>
          </button>

          <button className="add-sprite-btn" title="Upload Sprite">
            <div className="add-icon">
              <Upload size={20} />
            </div>
            <span>Upload</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .sprite-panel {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .panel-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #575E75;
        }
        
        .sprite-count {
          background: #E9EEF2;
          color: #575E75;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .sprites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 12px;
        }
        
        .sprite-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          border-radius: 8px;
          padding: 8px;
          transition: all 0.2s;
          border: 2px solid transparent;
        }
        
        .sprite-card:hover {
          background: #F2F2F2;
        }
        
        .sprite-card.selected {
          background: #E3F2FD;
          border-color: #4C97FF;
        }
        
        .sprite-thumbnail {
          width: 60px;
          height: 60px;
          background: #F2F2F2;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 8px;
          overflow: hidden;
        }
        
        .sprite-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .sprite-fallback {
          width: 100%;
          height: 100%;
          background: #4C97FF;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 24px;
        }
        
        .delete-sprite {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
          color: #666;
        }
        
        .sprite-card:hover .delete-sprite {
          opacity: 1;
        }
        
        .delete-sprite:hover {
          background: #FF4757;
          color: white;
        }
        
        .sprite-name {
          font-size: 12px;
          font-weight: 500;
          color: #575E75;
          text-align: center;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .add-sprite-options {
          display: contents;
        }
        
        .add-sprite-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: 2px dashed #D9D9D9;
          border-radius: 8px;
          padding: 12px 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #575E75;
          min-height: 80px;
        }
        
        .add-sprite-btn:hover {
          border-color: #4C97FF;
          background: #F0F8FF;
          color: #4C97FF;
        }
        
        .add-icon {
          margin-bottom: 4px;
          opacity: 0.7;
        }
        
        .add-sprite-btn span {
          font-size: 10px;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
        }
      `}</style>
    </div>
  )
}

export default SpritePanel
