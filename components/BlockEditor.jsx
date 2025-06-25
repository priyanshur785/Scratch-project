"use client"
import { ChevronDown, ChevronUp, Play, Trash2, Move } from "lucide-react"

const BlockEditor = ({ activeSprite, updateSprite, currentStep, setCurrentStep, onRunAll, onClearAll }) => {
  if (!activeSprite) {
    return (
      <div className="block-editor-empty">
        <div className="empty-message">
          <h4>No sprite selected</h4>
          <p>Select a sprite to start coding</p>
        </div>
      </div>
    )
  }

  const { name, blocks: topBlocks = [], speed = 1, size = 100, x = 0, y = 0 } = activeSprite

  const patch = (obj) => {
    updateSprite((prev) => ({ ...prev, ...obj }))
  }

  const makeBlock = (text) => {
    if (/^repeat\s+\d+\s+times$/i.test(text)) {
      return { text, editable: false, open: true, children: [] }
    }
    return { text, editable: false }
  }

  const handleDrop = (e, arr, setter) => {
    e.preventDefault()
    const text = e.dataTransfer.getData("text/plain")
    if (!text) return
    setter([...arr, makeBlock(text)])
  }

  // Helper function to determine block color based on category
  const getBlockColor = (text) => {
    const lowerText = text.toLowerCase()
    if (
      lowerText.includes("move") ||
      lowerText.includes("turn") ||
      lowerText.includes("go to") ||
      lowerText.includes("glide") ||
      lowerText.includes("point") ||
      lowerText.includes("change x") ||
      lowerText.includes("change y") ||
      lowerText.includes("set x") ||
      lowerText.includes("set y") ||
      lowerText.includes("if on edge")
    ) {
      return "#4C97FF" // Motion - blue
    } else if (
      lowerText.includes("say") ||
      lowerText.includes("think") ||
      lowerText.includes("costume") ||
      lowerText.includes("backdrop") ||
      lowerText.includes("size") ||
      lowerText.includes("effect") ||
      lowerText.includes("show") ||
      lowerText.includes("hide")
    ) {
      return "#9966FF" // Looks - purple
    } else if (lowerText.includes("sound") || lowerText.includes("volume")) {
      return "#CF63CF" // Sound - magenta
    } else if (lowerText.includes("when") || lowerText.includes("clicked")) {
      return "#FFBF00" // Events - yellow
    } else if (
      lowerText.includes("wait") ||
      lowerText.includes("repeat") ||
      lowerText.includes("forever") ||
      lowerText.includes("if") ||
      lowerText.includes("stop")
    ) {
      return "#FFAB19" // Control - orange
    } else if (
      lowerText.includes("touching") ||
      lowerText.includes("distance") ||
      lowerText.includes("ask") ||
      lowerText.includes("key") ||
      lowerText.includes("mouse") ||
      lowerText.includes("timer") ||
      lowerText.includes("loudness")
    ) {
      return "#5CB1D6" // Sensing - light blue
    } else if (
      lowerText.includes("+") ||
      lowerText.includes("-") ||
      lowerText.includes("*") ||
      lowerText.includes("/") ||
      lowerText.includes("random") ||
      lowerText.includes("=") ||
      lowerText.includes("<") ||
      lowerText.includes(">") ||
      lowerText.includes("and") ||
      lowerText.includes("or") ||
      lowerText.includes("not") ||
      lowerText.includes("join") ||
      lowerText.includes("letter") ||
      lowerText.includes("length") ||
      lowerText.includes("mod") ||
      lowerText.includes("round")
    ) {
      return "#59C059" // Operators - green
    } else if (lowerText.includes("variable")) {
      return "#FF8C1A" // Variables - orange
    } else if (lowerText.includes("define")) {
      return "#FF6680" // My Blocks - pink
    }
    return "#4C97FF" // Default - blue
  }

  // Helper function to determine block shape
  const getBlockShape = (text, isFirst, isLast) => {
    const lowerText = text.toLowerCase()
    if (/^repeat\s+\d+\s+times$/i.test(lowerText) || lowerText.includes("forever") || lowerText.includes("if")) {
      return "c-block" // C-shaped block
    }
    return "stack" // Regular stack block
  }

  // Helper function to render block content with inputs
  const renderBlockContent = (text) => {
    if (text.includes(" for ") && (text.includes("seconds") || text.includes("secs"))) {
      const parts = text.split(" for ")
      const secondParts = parts[1].split(" ")
      return (
        <div className="block-with-parts">
          {parts[0]} for <span className="block-input">{secondParts[0]}</span> {secondParts.slice(1).join(" ")}
        </div>
      )
    }

    if (text.includes(" to ") && (text.includes("costume") || text.includes("backdrop"))) {
      const parts = text.split(" to ")
      return (
        <div className="block-with-parts">
          {parts[0]} to <span className="block-dropdown">{parts[1]}</span>
        </div>
      )
    }

    if (text.includes(" by ")) {
      const parts = text.split(" by ")
      return (
        <div className="block-with-parts">
          {parts[0]} by <span className="block-number">{parts[1]}</span>
        </div>
      )
    }

    if (text.includes(" to ") && text.includes("%")) {
      const parts = text.split(" to ")
      return (
        <div className="block-with-parts">
          {parts[0]} to <span className="block-number">{parts[1]}</span>
        </div>
      )
    }

    if (text.includes("effect")) {
      if (text.includes(" by ")) {
        return (
          <div className="block-with-parts">
            Change <span className="block-dropdown">color</span> effect by <span className="block-number">25</span>
          </div>
        )
      } else {
        return (
          <div className="block-with-parts">
            Set <span className="block-dropdown">color</span> effect to <span className="block-number">0</span>
          </div>
        )
      }
    }

    return text
  }

  const renderBlocks = (arr, setter, depth = 0) =>
    arr.map((block, i) => {
      const isLoop = Array.isArray(block.children)
      const blockColor = getBlockColor(block.text)
      const blockShape = getBlockShape(block.text, i === 0, i === arr.length - 1)
      const isActive = i === currentStep
      const isLast = i === arr.length - 1

      return (
        <div key={i} style={{ marginLeft: depth * 20, position: "relative", userSelect: "none" }}>
          <div
            onClick={() => {
              if (block.editable) return
              if (isLoop) {
                const newBlocks = [...topBlocks]
                newBlocks[i] = { ...block, open: !block.open }
                patch({ blocks: newBlocks })
              }
              setCurrentStep(i)
            }}
            className={`block ${blockShape} ${isActive ? "active" : ""} ${isLast ? "last-block" : ""}`}
            style={{
              backgroundColor: isActive ? `${blockColor}dd` : blockColor,
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "30px",
              borderBottomLeftRadius: isLoop ? "0" : "4px",
              borderBottomRightRadius: isLoop ? "0" : "30px",
              boxShadow: isActive ? "0 0 0 2px #FFC107" : `0 2px 0 0 ${blockColor}99`,
            }}
          >
            <div className="block-content">
              {renderBlockContent(block.text)}
              {isLoop && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
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

            {/* Block Controls - Updated to match the screenshot */}
            <div className="block-controls">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (i > 0) {
                    const newBlocks = [...arr]
                    ;[newBlocks[i - 1], newBlocks[i]] = [newBlocks[i], newBlocks[i - 1]]
                    patch({ blocks: newBlocks })
                  }
                }}
                className="block-control-button"
                title="Move Up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (i < arr.length - 1) {
                    const newBlocks = [...arr]
                    ;[newBlocks[i], newBlocks[i + 1]] = [newBlocks[i + 1], newBlocks[i]]
                    patch({ blocks: newBlocks })
                  }
                }}
                className="block-control-button"
                title="Move Down"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  const newBlocks = arr.filter((_, idx) => idx !== i)
                  patch({ blocks: newBlocks })
                }}
                className="block-control-button delete"
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>

          {isLoop && block.open && (
            <div
              onDrop={(e) =>
                handleDrop(e, block.children, (newChildren) => {
                  const newBlocks = topBlocks.map((b, idx) => (idx === i ? { ...b, children: newChildren } : b))
                  patch({ blocks: newBlocks })
                })
              }
              onDragOver={(e) => e.preventDefault()}
              className="c-block-content"
              style={{
                borderLeft: `2px solid ${blockColor}`,
                borderRight: `2px solid ${blockColor}`,
                borderBottom: `2px solid ${blockColor}`,
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                backgroundColor: `${blockColor}22`,
                marginLeft: 10,
                paddingLeft: 8,
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              {renderBlocks(
                block.children,
                (newChildren) => {
                  const newBlocks = topBlocks.map((b, idx) => (idx === i ? { ...b, children: newChildren } : b))
                  patch({ blocks: newBlocks })
                },
                depth + 1,
              )}
              <div className="drop-hint">
                <Move size={14} /> Drop blocks here
              </div>
            </div>
          )}
        </div>
      )
    })

  const onClear = () => {
    patch({
      blocks: [],
      x: 50,
      y: 100,
      rotation: 0,
      speech: "",
      output: "",
      speed: 1,
      size: 100,
    })
    setCurrentStep(null)
  }

  return (
    <div
      className="block-editor"
      onDrop={(e) => handleDrop(e, topBlocks, (newBlocks) => patch({ blocks: newBlocks }))}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="editor-header">
        <h4>Editor for {name}</h4>
      </div>

      <div className="sprite-controls">
        <div className="control-group">
          <label className="control-label">
            Speed:
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => patch({ speed: +e.target.value })}
              className="slider"
            />
            <span className="value">{speed.toFixed(1)}x</span>
          </label>
        </div>

        <div className="control-group">
          <label className="control-label">
            Size:
            <input
              type="number"
              min="20"
              max="200"
              value={size}
              onChange={(e) => patch({ size: +e.target.value })}
              className="number-input"
            />
          </label>
        </div>

        <div className="control-group coordinates">
          <label className="control-label">
            X:
            <input type="number" value={x} onChange={(e) => patch({ x: +e.target.value })} className="number-input" />
          </label>

          <label className="control-label">
            Y:
            <input type="number" value={y} onChange={(e) => patch({ y: +e.target.value })} className="number-input" />
          </label>
        </div>
      </div>

      <div className="blocks-container">
        {renderBlocks(topBlocks, (newBlocks) => patch({ blocks: newBlocks }))}
        {topBlocks.length === 0 && (
          <div className="empty-blocks-message">
            <p>Drag blocks from the palette to start coding</p>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <button onClick={onRunAll} className="run-button">
          <Play size={16} /> Run All
        </button>
        <button onClick={onClearAll || onClear} className="clear-button">
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <style jsx>{`
  .block-editor {
    width: 50%;
    padding: 0;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ddd;
    height: 100%;
  }
  
  .block-editor-empty {
    width: 50%;
    padding: 20px;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #ddd;
  }
  
  .empty-message {
    text-align: center;
    color: #666;
  }
  
  .editor-header {
    background-color: #4C97FF;
    color: white;
    padding: 8px 15px;
    border-bottom: 1px solid #3373CC;
  }
  
  .editor-header h4 {
    margin: 0;
    font-size: 16px;
  }
  
  .sprite-controls {
    padding: 8px 15px;
    background-color: #e9eef2;
    border-bottom: 1px solid #ddd;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
  
  .control-group {
    display: flex;
    align-items: center;
  }
  
  .control-label {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    gap: 8px;
  }
  
  .slider {
    width: 100px;
    margin: 0 5px;
  }
  
  .number-input {
    width: 60px;
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  
  .value {
    min-width: 30px;
  }
  
  .coordinates {
    display: flex;
    gap: 10px;
  }
  
  .blocks-container {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background-color: white;
  }
  
  .block {
    margin: 0;
    padding: 6px 30px 6px 10px;
    cursor: pointer;
    position: relative;
    margin-bottom: -8px; /* Negative margin to create the stacked effect */
    z-index: 1;
  }
  
  .block:hover {
    z-index: 2; /* Ensure hovered blocks appear above others */
  }
  
  .block.last-block {
    margin-bottom: 10px; /* Add margin to the last block */
  }
  
  .block-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    font-weight: 500;
  }
  
  .block-with-parts {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .block-input, .block-dropdown, .block-number {
    background-color: white;
    color: #333;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 12px;
    min-width: 20px;
    text-align: center;
    display: inline-block;
  }
  
  .block-dropdown {
    position: relative;
    padding-right: 16px;
  }
  
  .block-dropdown:after {
    content: "▼";
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8px;
  }
  
  .block-number {
    min-width: 30px;
  }
  
  .toggle-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    margin-left: 8px;
    display: flex;
    align-items: center;
  }
  
  .block-controls {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    display: flex;
    gap: 0;
    opacity: 1;
  }
  
  .block:hover .block-controls {
    opacity: 1;
  }
  
  .block-control-button {
    width: 16px;
    height: 16px;
    border: none;
    background-color: transparent;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    font-size: 10px;
    line-height: 1;
  }
  
  .block-control-button:hover {
    color: white;
  }
  
  .block-control-button.delete {
    color: black;
  }
  
  .block-control-button.delete:hover {
    color: white;
  }
  
  .c-block-content {
    margin-bottom: 10px;
  }
  
  .drop-hint {
    padding: 8px;
    color: #666;
    font-style: italic;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
  }
  
  .empty-blocks-message {
    padding: 20px;
    text-align: center;
    color: #666;
    border: 2px dashed #ddd;
    border-radius: 8px;
    margin: 20px 0;
  }
  
  .editor-footer {
    padding: 10px 15px;
    background-color: #e9eef2;
    border-top: 1px solid #ddd;
    display: flex;
    gap: 10px;
  }
  
  .run-button, .clear-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .run-button {
    background-color: #4CAF50;
    color: white;
  }
  
  .run-button:hover {
    background-color: #43A047;
  }
  
  .clear-button {
    background-color: #F44336;
    color: white;
  }
  
  .clear-button:hover {
    background-color: #E53935;
  }
  
  .active {
    box-shadow: 0 0 0 2px #FFC107 !important;
  }
`}</style>
    </div>
  )
}

export default BlockEditor
