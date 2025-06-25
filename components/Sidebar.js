"use client"

import React from "react"
import { MoveHorizontal, MessageCircle, Repeat } from "lucide-react"

const blockCategories = [
  {
    name: "Motion",
    color: "#4C97FF",
    icon: <MoveHorizontal size={16} />,
    blocks: [
      "Move 10 Steps",
      "Turn Right",
      "Turn Left",
      "Go to X:100 Y:100",
      "Go to Random Position",
      "Point in Direction 90",
    ],
  },
  {
    name: "Looks",
    color: "#9966FF",
    icon: <MessageCircle size={16} />,
    blocks: [
      "Say Hello for 2 seconds",
      "Say Hello",
      "Think Hmm... for 2 seconds",
      "Think Hmm...",
      "Switch costume to costume2",
      "Next costume",
      "Switch backdrop to backdrop1",
      "Next backdrop to",
      "Change size by 10",
    ],
  },
  {
    name: "Control",
    color: "#FFAB19",
    icon: <Repeat size={16} />,
    blocks: ["Wait 1 Second", "Repeat 10 times"],
  },
]

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = React.useState(0)

  const handleDragStart = (e, text) => {
    e.dataTransfer.setData("text/plain", text)
  }

  const currentBlocks = blockCategories[activeCategory].blocks

  const renderBlockContent = (block) => {
    // Handle "Say" blocks with duration
    if (block === "Say Hello for 2 seconds") {
      return (
        <div className="block-content">
          <div className="block-line">Say Hello for</div>
          <div className="block-line">
            <span className="block-input">2</span> seconds
          </div>
        </div>
      )
    }

    // Handle simple "Say" blocks
    if (block === "Say Hello") {
      return (
        <div className="block-content">
          <div className="block-line">Say Hello</div>
        </div>
      )
    }

    // Handle "Think" blocks with duration
    if (block === "Think Hmm... for 2 seconds") {
      return (
        <div className="block-content">
          <div className="block-line">Think Hmm...</div>
          <div className="block-line">
            for <span className="block-input">2</span> seconds
          </div>
        </div>
      )
    }

    // Handle simple "Think" blocks
    if (block === "Think Hmm...") {
      return (
        <div className="block-content">
          <div className="block-line">Think Hmm...</div>
        </div>
      )
    }

    // Handle costume blocks
    if (block === "Switch costume to costume2") {
      return (
        <div className="block-content">
          <div className="block-line">Switch costume to</div>
          <div className="block-line">
            <span className="block-dropdown">costume2 ▼</span>
          </div>
        </div>
      )
    }

    // Handle backdrop blocks
    if (block === "Switch backdrop to backdrop1") {
      return (
        <div className="block-content">
          <div className="block-line">Switch backdrop to</div>
          <div className="block-line">
            <span className="block-dropdown">backdrop1 ▼</span>
          </div>
        </div>
      )
    }

    // Handle size change blocks
    if (block === "Change size by 10") {
      return (
        <div className="block-content">
          <div className="block-line">Change size by</div>
          <div className="block-line">
            <span className="block-input">10</span>
          </div>
        </div>
      )
    }

    // Default single line blocks
    return (
      <div className="block-content">
        <div className="block-line">{block}</div>
      </div>
    )
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>Block Palette</h4>
      </div>

      <div className="category-tabs">
        {blockCategories.map((category, index) => (
          <button
            key={index}
            className={`category-tab ${activeCategory === index ? "active" : ""}`}
            style={{
              backgroundColor: activeCategory === index ? category.color : "transparent",
              color: activeCategory === index ? "white" : "#333",
            }}
            onClick={() => setActiveCategory(index)}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="blocks-list">
        {currentBlocks.map((block, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            className="scratch-block"
            style={{
              backgroundColor: blockCategories[activeCategory].color,
            }}
          >
            {renderBlockContent(block)}
          </div>
        ))}

        {currentBlocks.length === 0 && (
          <div className="empty-category">
            <p>No blocks in this category yet</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .sidebar {
          width: 280px;
          height: 100%;
          background: linear-gradient(145deg, #f8f9fa, #e9ecef);
          display: flex;
          flex-direction: column;
          border-right: 1px solid #ddd;
          box-shadow: 
            inset -2px 0 4px rgba(0,0,0,0.1),
            2px 0 8px rgba(0,0,0,0.15);
          position: relative;
        }
        
        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        }
        
        .sidebar-header {
          padding: 12px 15px;
          background: linear-gradient(145deg, #4C97FF, #3373CC);
          color: white;
          border-bottom: 1px solid #2c5aa0;
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
        }
        
        .sidebar-header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }
        
        .sidebar-header h4 {
          margin: 0;
          font-size: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          font-weight: 600;
        }
        
        .category-tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          background: linear-gradient(145deg, #e9eef2, #d6dce2);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .category-tab {
          flex: 1;
          padding: 12px 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border-radius: 8px 8px 0 0;
          margin: 2px 1px 0 1px;
        }
        
        .category-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.05));
          border-radius: 8px 8px 0 0;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .category-tab:hover::before {
          opacity: 1;
        }
        
        .category-tab.active {
          font-weight: 600;
          transform: translateY(-2px);
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.3);
          border-bottom: 2px solid transparent;
        }
        
        .category-tab:hover {
          transform: translateY(-1px);
        }
        
        .blocks-list {
          flex: 1;
          padding: 20px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: linear-gradient(145deg, #ffffff, #f8f9fa);
        }
        
        .scratch-block {
          padding: 14px 18px;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          cursor: grab;
          user-select: none;
          font-size: 14px;
          line-height: 1.3;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 44px;
          display: flex;
          align-items: center;
          position: relative;
          transform-style: preserve-3d;
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.15),
            0 2px 4px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.1);
        }

        .scratch-block::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(145deg, rgba(255,255,255,0.2), rgba(0,0,0,0.1));
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .scratch-block:hover::before {
          opacity: 1;
        }

        .scratch-block:active {
          cursor: grabbing;
          transform: translateY(2px) scale(0.98);
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.2),
            0 1px 2px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .scratch-block:hover {
          transform: translateY(-2px) rotateX(5deg);
          box-shadow: 
            0 8px 16px rgba(0,0,0,0.2),
            0 4px 8px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.3),
            inset 0 -1px 0 rgba(0,0,0,0.1);
        }

        .block-content {
          width: 100%;
          line-height: 1.4;
          position: relative;
          z-index: 1;
        }

        .block-line {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 3px;
        }

        .block-line:last-child {
          margin-bottom: 0;
        }

        .block-input {
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          color: #333;
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          display: inline-block;
          text-align: center;
          min-width: 28px;
          margin: 0 2px;
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: 
            inset 0 1px 2px rgba(0,0,0,0.1),
            0 1px 0 rgba(255,255,255,0.8);
          text-shadow: 0 1px 0 rgba(255,255,255,0.8);
        }

        .block-dropdown {
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          color: #333;
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          display: inline-block;
          margin: 0 2px;
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: 
            inset 0 1px 2px rgba(0,0,0,0.1),
            0 1px 0 rgba(255,255,255,0.8);
          text-shadow: 0 1px 0 rgba(255,255,255,0.8);
        }
        
        .empty-category {
          text-align: center;
          color: #999;
          font-style: italic;
          padding: 30px 20px;
          background: linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.05));
          border-radius: 12px;
          border: 2px dashed #ddd;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }

        /* Custom scrollbar for 3D effect */
        .blocks-list::-webkit-scrollbar {
          width: 8px;
        }

        .blocks-list::-webkit-scrollbar-track {
          background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
          border-radius: 4px;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }

        .blocks-list::-webkit-scrollbar-thumb {
          background: linear-gradient(145deg, #c0c0c0, #a0a0a0);
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .blocks-list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(145deg, #b0b0b0, #909090);
        }
      `}</style>
    </div>
  )
}

export default Sidebar
