"use client"
import { Play, Square, ChevronDown, ChevronUp } from "lucide-react"
import { useBlockSnapping, SnapIndicator } from "./BlockSnapping"
import { useRef, useState } from "react"

const CodeEditor = ({ activeSprite, updateSprite, onRunAll, onStopAll, isRunning, sprites = [] }) => {
  const containerRef = useRef(null)
  const [draggedOver, setDraggedOver] = useState(false)
  const { draggedBlock, setDraggedBlock, snapTarget, setSnapTarget, snapPosition, setSnapPosition, findSnapTarget } =
    useBlockSnapping()

  if (!activeSprite) {
    return (
      <div className="code-editor-empty">
        <div className="empty-state">
          <div className="empty-icon">🐱</div>
          <h3>Choose a sprite to start coding</h3>
          <p>Select a sprite from the sprite panel to see its scripts here.</p>
        </div>
      </div>
    )
  }

  const { name, blocks: topBlocks = [] } = activeSprite

  const patch = (obj) => {
    updateSprite((prev) => ({ ...prev, ...obj }))
  }

  const makeBlock = (text) => {
    if (text.includes("repeat") || text.includes("forever") || text.includes("if")) {
      return { text, editable: false, open: true, children: [] }
    }
    return { text, editable: false }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDraggedOver(false)

    const text = e.dataTransfer.getData("text/plain")
    if (!text) return

    const newBlock = makeBlock(text)

    if (snapTarget && snapPosition) {
      console.log("Snapped drop:", snapTarget, snapPosition)
    } else {
      patch({ blocks: [...topBlocks, newBlock] })
    }

    setSnapTarget(null)
    setSnapPosition(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDraggedOver(true)

    const target = findSnapTarget(e.clientX, e.clientY, containerRef)
    setSnapTarget(target?.element || null)
    setSnapPosition(target || null)
  }

  const handleDragLeave = (e) => {
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setDraggedOver(false)
      setSnapTarget(null)
      setSnapPosition(null)
    }
  }

  const getBlockColor = (text) => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("move") || lowerText.includes("turn") || lowerText.includes("go")) {
      return "#4C97FF"
    } else if (lowerText.includes("say") || lowerText.includes("think") || lowerText.includes("costume")) {
      return "#9966FF"
    } else if (lowerText.includes("sound")) {
      return "#CF63CF"
    } else if (lowerText.includes("when") || lowerText.includes("🏁")) {
      return "#FFBF00"
    } else if (lowerText.includes("wait") || lowerText.includes("repeat") || lowerText.includes("forever")) {
      return "#FFAB19"
    } else if (lowerText.includes("touching") || lowerText.includes("key")) {
      return "#5CB1D6"
    } else if (lowerText.includes("+") || lowerText.includes("-") || lowerText.includes("random")) {
      return "#59C059"
    } else if (lowerText.includes("variable") || lowerText.includes("set [") || lowerText.includes("change [")) {
      return "#FF8C1A"
    }
    return "#4C97FF"
  }

  const getBlockShape = (text) => {
    if (text.includes("when ") || text.includes("🏁")) return "hat-block"
    if (text.includes("<") && text.includes(">")) return "boolean-block"
    if (text.startsWith("(") && text.endsWith(")")) return "reporter-block"
    if (text.includes("repeat") || text.includes("forever") || text.includes("if")) return "c-block"
    return "stack-block"
  }

  const renderBlockContent = (text) => {
    let content = text
    content = content.replace(/$$([^)]+)$$/g, '<span class="block-input">$1</span>')
    content = content.replace(/\[([^\]]+)\]/g, '<span class="block-text-input">$1</span>')
    content = content.replace(/<([^>]+)>/g, '<span class="block-boolean">$1</span>')
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }

  const renderBlocks = (arr, setter, depth = 0) =>
    arr.map((block, i) => {
      const isLoop = Array.isArray(block.children)
      const blockColor = getBlockColor(block.text)
      const blockShape = getBlockShape(block.text)

      return (
        <div key={i} style={{ marginLeft: depth * 20, marginBottom: 4 }}>
          <div className={`code-block ${blockShape}`} style={{ backgroundColor: blockColor }} data-block-index={i}>
            <div className="block-content">
              {renderBlockContent(block.text)}
              {isLoop && (
                <button
                  onClick={() => {
                    const newBlocks = [...topBlocks]
                    newBlocks[i] = { ...block, open: !block.open }
                    patch({ blocks: newBlocks })
                  }}
                  className="toggle-button"
                >
                  {block.open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
            </div>

            <div className="block-controls">
              <button
                onClick={() => {
                  const newBlocks = arr.filter((_, idx) => idx !== i)
                  patch({ blocks: newBlocks })
                }}
                className="delete-block"
                title="Delete block"
              >
                ×
              </button>
            </div>
          </div>

          {isLoop && block.open && (
            <div
              className="c-block-content"
              style={{ borderColor: blockColor }}
              onDrop={(e) => {
                e.preventDefault()
                const text = e.dataTransfer.getData("text/plain")
                if (!text) return

                const newChildren = [...(block.children || []), makeBlock(text)]
                const newBlocks = topBlocks.map((b, idx) => (idx === i ? { ...b, children: newChildren } : b))
                patch({ blocks: newBlocks })
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {renderBlocks(
                block.children || [],
                (newChildren) => {
                  const newBlocks = topBlocks.map((b, idx) => (idx === i ? { ...b, children: newChildren } : b))
                  patch({ blocks: newBlocks })
                },
                depth + 1,
              )}
              <div className="drop-zone">Drop blocks here</div>
            </div>
          )}
        </div>
      )
    })

  // Count how many sprites will run simultaneously
  const spritesWithBlocks = sprites.filter((sprite) => sprite.blocks && sprite.blocks.length > 0)
  const runAllText = `Run All (${spritesWithBlocks.length} sprites)`

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="editor-title">
          <span className="sprite-icon">🐱</span>
          <span>Code for {name}</span>
        </div>

        <div className="editor-controls">
          <button
            className="run-all-button"
            onClick={onRunAll}
            title={`Run all ${spritesWithBlocks.length} sprites simultaneously - they will all start at the same time!`}
            disabled={isRunning}
          >
            <Play size={16} />
            {runAllText}
          </button>
          <button className="stop-button" onClick={onStopAll} title="Stop all sprites">
            <Square size={14} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`scripts-area ${draggedOver ? "drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <SnapIndicator snapPosition={snapPosition} snapTarget={snapTarget} />

        {topBlocks.length === 0 ? (
          <div className="empty-scripts">
            <div className="empty-scripts-content">
              <div className="empty-scripts-icon">📝</div>
              <h4>Start creating by dragging blocks here!</h4>
              <p>Drag blocks from the palette on the left to build your script.</p>
              <div className="hint-animation">
                <div className="drag-hint">👆 Drag a block here</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="scripts-container">
            {renderBlocks(topBlocks, (newBlocks) => patch({ blocks: newBlocks }))}
          </div>
        )}
      </div>

      <style jsx>{`
        .code-editor {
          flex: 1;
          background: #F9F9F9;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .code-editor-empty {
          flex: 1;
          background: #F9F9F9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .empty-state {
          text-align: center;
          color: #575E75;
          max-width: 300px;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .empty-state p {
          margin: 0;
          font-size: 14px;
          opacity: 0.8;
        }
        
        .editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #E5E5E5;
        }
        
        .editor-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #575E75;
        }
        
        .sprite-icon {
          font-size: 20px;
        }
        
        .editor-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .run-all-button {
          background: #4CBB17;
          border: none;
          border-radius: 6px;
          color: white;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 14px;
          position: relative;
        }
        
        .run-all-button::after {
          content: '⚡ Simultaneous';
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        
        .run-all-button:hover::after {
          opacity: 1;
        }
        
        .run-all-button:hover:not(:disabled) {
          background: #45A015;
          transform: translateY(-1px);
        }
        
        .run-all-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .stop-button {
          background: #FF4757;
          border: none;
          border-radius: 6px;
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
        
        .scripts-area {
          flex: 1;
          padding: 20px;
          overflow: auto;
          background: white;
          position: relative;
          transition: background-color 0.2s;
        }
        
        .scripts-area.drag-over {
          background: #F0F8FF;
        }
        
        .empty-scripts {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .empty-scripts-content {
          text-align: center;
          color: #575E75;
          max-width: 300px;
        }
        
        .empty-scripts-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .empty-scripts-content h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .empty-scripts-content p {
          margin: 0 0 20px 0;
          font-size: 14px;
          opacity: 0.8;
        }
        
        .hint-animation {
          margin-top: 20px;
        }
        
        .drag-hint {
          background: #E3F2FD;
          border: 2px dashed #4C97FF;
          padding: 16px;
          border-radius: 8px;
          color: #4C97FF;
          font-weight: 500;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .scripts-container {
          min-height: 100%;
        }
        
        .code-block {
          padding: 8px 12px;
          border-radius: 4px;
          color: white;
          font-weight: 500;
          position: relative;
          cursor: grab;
          user-select: none;
          font-size: 13px;
          box-shadow: 0 2px 0 rgba(0,0,0,0.15);
          margin-bottom: 2px;
        }
        
        .code-block:active {
          cursor: grabbing;
        }
        
        .hat-block {
          border-radius: 16px 16px 4px 4px;
        }
        
        .boolean-block {
          border-radius: 12px;
        }
        
        .reporter-block {
          border-radius: 12px;
        }
        
        .c-block {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        
        .block-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .code-block :global(.block-input) {
          background: rgba(255,255,255,0.9);
          color: #333;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 12px;
          min-width: 20px;
          display: inline-block;
          text-align: center;
          margin: 0 2px;
        }
        
        .code-block :global(.block-text-input) {
          background: rgba(255,255,255,0.9);
          color: #333;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 12px;
          display: inline-block;
          margin: 0 2px;
        }
        
        .code-block :global(.block-boolean) {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 12px;
          display: inline-block;
          margin: 0 2px;
          border: 1px solid rgba(255,255,255,0.3);
        }
        
        .toggle-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }
        
        .block-controls {
          position: absolute;
          top: 4px;
          right: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .code-block:hover .block-controls {
          opacity: 1;
        }
        
        .delete-block {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .delete-block:hover {
          background: #FF4757;
        }
        
        .c-block-content {
          border-left: 2px solid;
          border-right: 2px solid;
          border-bottom: 2px solid;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          padding: 8px;
          margin-left: 16px;
          background: rgba(255,255,255,0.1);
        }
        
        .drop-zone {
          padding: 16px;
          text-align: center;
          color: #999;
          font-style: italic;
          border: 2px dashed #DDD;
          border-radius: 4px;
          margin: 8px 0;
          transition: all 0.2s;
        }
        
        .drop-zone:hover {
          border-color: #4C97FF;
          color: #4C97FF;
          background: rgba(76, 151, 255, 0.05);
        }
      `}</style>
    </div>
  )
}

export default CodeEditor
