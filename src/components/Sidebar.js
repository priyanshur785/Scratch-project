"use client"
import React from "react"
import { VariableManager } from "./VariableManager"

const blockCategories = [
  {
    name: "Motion",
    color: "#4C97FF",
    icon: "🏃",
    blocks: [
      "move (10) steps",
      "turn ↻ (15) degrees",
      "turn ↺ (15) degrees",
      "go to (random position ▼)",
      "go to x: (0) y: (0)",
      "glide (1) secs to x: (0) y: (0)",
      "point in direction (90)",
      "point towards (mouse-pointer ▼)",
      "change x by (10)",
      "set x to (0)",
      "change y by (10)",
      "set y to (0)",
      "if on edge, bounce",
      "set rotation style (left-right ▼)",
    ],
  },
  {
    name: "Looks",
    color: "#9966FF",
    icon: "👁️",
    blocks: [
      "say [Hello!] for (2) seconds",
      "say [Hello!]",
      "think [Hmm...] for (2) seconds",
      "think [Hmm...]",
      "switch costume to (costume1 ▼)",
      "next costume",
      "switch backdrop to (backdrop1 ▼)",
      "change [color ▼] effect by (25)",
      "set [color ▼] effect to (0)",
      "clear graphic effects",
      "change size by (10)",
      "set size to (100) %",
      "show",
      "hide",
      "go to [front ▼] layer",
      "go [forward ▼] (1) layers",
    ],
  },
  {
    name: "Sound",
    color: "#CF63CF",
    icon: "🔊",
    blocks: [
      "play sound (Meow ▼) until done",
      "start sound (Meow ▼)",
      "stop all sounds",
      "change [pitch ▼] effect by (10)",
      "set [pitch ▼] effect to (100)",
      "clear sound effects",
      "change volume by (-10)",
      "set volume to (100) %",
    ],
  },
  {
    name: "Events",
    color: "#FFBF00",
    icon: "🏁",
    blocks: [
      "when 🏁 clicked",
      "when [space ▼] key pressed",
      "when this sprite clicked",
      "when backdrop switches to [backdrop1 ▼]",
      "when [loudness ▼] > (10)",
      "when I receive [message1 ▼]",
      "broadcast [message1 ▼]",
      "broadcast [message1 ▼] and wait",
    ],
  },
  {
    name: "Control",
    color: "#FFAB19",
    icon: "⚙️",
    blocks: [
      "wait (1) seconds",
      "repeat (10)",
      "forever",
      "if <> then",
      "if <> then else",
      "wait until <>",
      "repeat until <>",
      "stop [all ▼]",
    ],
  },
  {
    name: "Sensing",
    color: "#5CB1D6",
    icon: "👆",
    blocks: [
      "<touching (mouse-pointer ▼) ?>",
      "<touching color [#ff0000] ?>",
      "<color [#ff0000] is touching [#0000ff] ?>",
      "(distance to (mouse-pointer ▼))",
      "ask [What's your name?] and wait",
      "(answer)",
      "<key (space ▼) pressed?>",
      "<mouse down?>",
      "(mouse x)",
      "(mouse y)",
      "(loudness)",
      "(timer)",
      "reset timer",
    ],
  },
  {
    name: "Operators",
    color: "#59C059",
    icon: "🔢",
    blocks: [
      "(() + ())",
      "(() - ())",
      "(() * ())",
      "(() / ())",
      "(pick random (1) to (10))",
      "<() < ()>",
      "<() = ()>",
      "<() > ()>",
      "<() and ()>",
      "<() or ()>",
      "<not ()>",
      "(join [apple] [banana])",
      "(letter (1) of [world])",
      "(length of [world])",
      "(() mod ())",
      "(round ())",
    ],
  },
  {
    name: "Variables",
    color: "#FF8C1A",
    icon: "📊",
    blocks: [],
  },
]

const Sidebar = ({ variables = [], setVariables, onCreateVariable }) => {
  const [activeCategory, setActiveCategory] = React.useState(0)

  const handleDragStart = (e, text) => {
    e.dataTransfer.setData("text/plain", text)
    e.dataTransfer.effectAllowed = "copy"
  }

  const renderBlock = (blockText) => {
    // Handle multi-line blocks
    if (
      blockText.includes("for") &&
      blockText.includes("seconds") &&
      (blockText.includes("Say") || blockText.includes("Think"))
    ) {
      const parts = blockText.split(" for ")
      const textPart = parts[0].replace(/\[([^\]]+)\]/, "$1")
      const timePart = parts[1].replace(/$$([^)]+)$$/, "$1").replace(" seconds", "")

      return (
        <div className="block-content-wrapper">
          <div className="block-line">{textPart} for</div>
          <div className="block-line">
            <span className="block-input-round">{timePart}</span> seconds
          </div>
        </div>
      )
    }

    // Handle costume/backdrop blocks with dropdowns
    if (blockText.includes("costume to") || blockText.includes("backdrop to")) {
      const parts = blockText.split(" to ")
      const dropdownValue = parts[1].replace(/$$([^)]+)$$/, "$1").replace(" ▼", "")

      return (
        <div className="block-content-wrapper">
          <div className="block-line">{parts[0]} to</div>
          <div className="block-line">
            <span className="block-dropdown">{dropdownValue} ▼</span>
          </div>
        </div>
      )
    }

    // Handle size change blocks
    if (blockText.includes("Change size by")) {
      const value = blockText.match(/$$([^)]+)$$/)?.[1] || "10"
      return (
        <div className="block-content-wrapper">
          <div className="block-line">Change size</div>
          <div className="block-line">
            by <span className="block-input-round">{value}</span>
          </div>
        </div>
      )
    }

    // Default single-line processing
    let content = blockText
    content = content.replace(/$$([^)]+)$$/g, '<span class="block-input-round">$1</span>')
    content = content.replace(/\[([^\]]+)\]/g, "$1")
    content = content.replace(/ ▼/g, ' <span class="dropdown-arrow">▼</span>')

    return <div className="block-content-wrapper" dangerouslySetInnerHTML={{ __html: content }} />
  }

  const getBlockShape = (blockText) => {
    if (blockText.startsWith("when ") || blockText.includes("🏁")) return "hat-block"
    if (blockText.includes("<") && blockText.includes(">")) return "boolean-block"
    if (blockText.startsWith("(") && blockText.endsWith(")")) return "reporter-block"
    if (blockText.includes("repeat") || blockText.includes("forever") || blockText.includes("if")) return "c-block"
    return "stack-block"
  }

  // Generate variable blocks
  const variableBlocks = variables.flatMap((variable) => [
    `(${variable.name})`,
    `set [${variable.name} ▼] to (0)`,
    `change [${variable.name} ▼] by (1)`,
    `show variable [${variable.name} ▼]`,
    `hide variable [${variable.name} ▼]`,
  ])

  const currentBlocks = activeCategory === 7 ? variableBlocks : blockCategories[activeCategory].blocks

  return (
    <div className="scratch-sidebar">
      <div className="category-selector">
        {blockCategories.map((category, index) => (
          <button
            key={index}
            className={`category-button ${activeCategory === index ? "active" : ""}`}
            style={{
              backgroundColor: activeCategory === index ? category.color : "#E9EEF2",
              color: activeCategory === index ? "white" : "#575E75",
            }}
            onClick={() => setActiveCategory(index)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="blocks-palette">
        <div className="palette-header">
          <h3 style={{ color: blockCategories[activeCategory].color }}>{blockCategories[activeCategory].name}</h3>
        </div>

        <div className="blocks-list">
          {activeCategory === 7 && (
            <VariableManager variables={variables} setVariables={setVariables} onCreateVariable={onCreateVariable} />
          )}

          {currentBlocks.map((block, i) => {
            const blockShape = getBlockShape(block)

            return (
              <div
                key={i}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                className={`scratch-block ${blockShape}`}
                style={{
                  backgroundColor: blockCategories[activeCategory].color,
                }}
              >
                {renderBlock(block)}
              </div>
            )
          })}

          {currentBlocks.length === 0 && activeCategory !== 7 && (
            <div className="empty-category">
              <p>No blocks in this category yet</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scratch-sidebar {
          width: 280px;
          height: 100%;
          background: #F9F9F9;
          display: flex;
          border-right: 1px solid #E5E5E5;
        }
        
        .category-selector {
          width: 80px;
          background: #E9EEF2;
          display: flex;
          flex-direction: column;
          padding: 8px 0;
          gap: 2px;
        }
        
        .category-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 8px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 8px;
          margin: 0 4px;
          transition: all 0.2s;
          font-size: 11px;
          font-weight: 500;
        }
        
        .category-button:hover {
          transform: translateY(-1px);
        }
        
        .category-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }
        
        .category-name {
          text-align: center;
          line-height: 1.2;
        }
        
        .blocks-palette {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }
        
        .palette-header {
          padding: 16px;
          border-bottom: 1px solid #E5E5E5;
        }
        
        .palette-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .blocks-list {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .scratch-block {
          padding: 10px 14px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          cursor: grab;
          user-select: none;
          position: relative;
          font-size: 14px;
          line-height: 1.3;
          box-shadow: 0 2px 0 rgba(0,0,0,0.15);
          transition: transform 0.1s;
          margin-bottom: 6px;
          min-height: 32px;
          display: flex;
          align-items: center;
        }

        .scratch-block:active {
          cursor: grabbing;
          transform: scale(0.98);
        }

        .scratch-block:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 0 rgba(0,0,0,0.15);
        }

        .block-content-wrapper {
          width: 100%;
          line-height: 1.4;
        }

        .block-line {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 2px;
        }

        .block-line:last-child {
          margin-bottom: 0;
        }

        .scratch-block :global(.block-input-round) {
          background: white;
          color: #333;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          display: inline-block;
          text-align: center;
          min-width: 24px;
          margin: 0 2px;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .scratch-block :global(.block-dropdown) {
          background: white;
          color: #333;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          display: inline-block;
          margin: 0 2px;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .scratch-block :global(.dropdown-arrow) {
          font-size: 10px;
          margin-left: 2px;
        }

        .hat-block {
          border-radius: 16px 16px 8px 8px;
          padding-top: 12px;
        }

        .boolean-block {
          border-radius: 16px;
          padding: 8px 12px;
        }

        .reporter-block {
          border-radius: 16px;
          padding: 8px 12px;
        }

        .c-block {
          border-radius: 8px 8px 0 0;
          padding-bottom: 8px;
        }
        
        .empty-category {
          text-align: center;
          color: #999;
          font-style: italic;
          padding: 20px;
        }
      `}</style>
    </div>
  )
}

export default Sidebar
