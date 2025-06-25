"use client"
import { useState, useEffect, useRef } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import StageArea from "./StageArea"
import SpritePanel from "./SpritePanel"
import CodeEditor from "./CodeEditor"
import { BlockExecutor } from "./BlockExecutor"

const App = () => {
  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: "Cat",
      blocks: [
        { text: "when 🏁 clicked" },
        { text: "say [Hello from Cat!] for (2) seconds" },
        { text: "move (10) steps" },
        { text: "turn ↻ (15) degrees" },
        { text: "move (10) steps" },
      ],
      x: 100,
      y: 150,
      rotation: 0,
      size: 100,
      speech: "",
      output: "",
      speed: 1,
      visible: true,
    },
    {
      id: 2,
      name: "Dog",
      blocks: [
        { text: "when 🏁 clicked" },
        { text: "say [Woof from Dog!] for (1) seconds" },
        { text: "move (20) steps" },
        { text: "turn ↻ (30) degrees" },
        { text: "move (15) steps" },
      ],
      x: 250,
      y: 150,
      rotation: 0,
      size: 100,
      speech: "",
      output: "",
      speed: 1,
      visible: true,
    },
  ])

  const [selectedId, setSelectedId] = useState(1)
  const [activeTab, setActiveTab] = useState("code")
  const [variables, setVariables] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const executorRef = useRef(null)

  // Initialize executor
  useEffect(() => {
    const blockExecutor = new BlockExecutor(sprites, setSprites)
    executorRef.current = blockExecutor
    console.log("🔧 BlockExecutor initialized")
  }, [])

  // Update executor when sprites change
  useEffect(() => {
    if (executorRef.current) {
      executorRef.current.sprites = sprites
      executorRef.current.setSprites = setSprites
      console.log(
        "🔄 BlockExecutor updated with new sprites:",
        sprites.map((s) => s.name),
      )
    }
  }, [sprites])

  const updateSprite = (updater) => {
    setSprites((sprites) =>
      sprites.map((s) => {
        if (s.id !== selectedId) return s
        return typeof updater === "function" ? updater(s) : { ...s, ...updater }
      }),
    )
  }

  const handleSelectSprite = (id) => {
    setSelectedId(id)
  }

  const handleAddSprite = () => {
    const newId = Math.max(0, ...sprites.map((s) => s.id)) + 1
    const spriteNames = ["Bird", "Alien", "Car", "Ball"]
    const existingNames = sprites.map((s) => s.name.toLowerCase())

    let spriteName = "Sprite"
    for (const name of spriteNames) {
      if (!existingNames.includes(name.toLowerCase())) {
        spriteName = name
        break
      }
    }

    if (spriteName === "Sprite") {
      spriteName = `Sprite ${newId}`
    }

    const newSprite = {
      id: newId,
      name: spriteName,
      blocks: [
        { text: "when 🏁 clicked" },
        { text: `say [Hello from ${spriteName}!] for (2) seconds` },
        { text: "move (15) steps" },
        { text: "turn ↻ (20) degrees" },
      ],
      x: 100 + newId * 30,
      y: 150,
      rotation: 0,
      size: 100,
      speech: "",
      output: "",
      speed: 1,
      visible: true,
    }

    setSprites([...sprites, newSprite])
    setSelectedId(newId)
  }

  const handleRemoveSprite = (id) => {
    if (sprites.length <= 1) return

    setSprites((prev) => prev.filter((s) => s.id !== id))
    if (selectedId === id) {
      const remaining = sprites.filter((s) => s.id !== id)
      setSelectedId(remaining.length ? remaining[0].id : null)
    }
  }

  // 🚀 RUN ALL - Execute ALL sprites simultaneously
  const handleRunAll = async () => {
    if (!executorRef.current || isRunning) return

    console.log("🚀 USER CLICKED RUN ALL")
    console.log(
      "📊 Current sprites:",
      sprites.map((s) => ({ name: s.name, blocks: s.blocks?.length || 0 })),
    )

    setIsRunning(true)

    try {
      await executorRef.current.runAllSprites()
    } catch (error) {
      console.error("❌ Run All failed:", error)
    } finally {
      setIsRunning(false)
    }
  }

  // 🏁 FLAG - Execute only selected sprite
  const handleRunFlag = async () => {
    if (!executorRef.current || isRunning || !selectedId) return

    console.log(`🏁 USER CLICKED FLAG for sprite ${selectedId}`)
    setIsRunning(true)

    try {
      await executorRef.current.runSelectedSprite(selectedId)
    } catch (error) {
      console.error("❌ Flag execution failed:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleStopAll = () => {
    console.log("🛑 USER CLICKED STOP")
    if (executorRef.current) {
      executorRef.current.stop()
    }
    setIsRunning(false)
  }

  const handleCreateVariable = (variable) => {
    console.log("Created variable:", variable)
  }

  useEffect(() => {
    const handleUpdate = (e) => {
      const { id, x, y } = e.detail
      setSprites((s) => s.map((sprite) => (sprite.id === id ? { ...sprite, x, y } : sprite)))
    }
    window.addEventListener("update-sprite-position", handleUpdate)
    return () => window.removeEventListener("update-sprite-position", handleUpdate)
  }, [])

  const activeSprite = sprites.find((s) => s.id === selectedId)

  return (
    <div className="scratch-app">
      <Header />

      <div className="app-content">
        <Sidebar variables={variables} setVariables={setVariables} onCreateVariable={handleCreateVariable} />

        <div className="main-workspace">
          <div className="workspace-top">
            <StageArea
              sprites={sprites}
              selectedId={selectedId}
              onRunFlag={handleRunFlag}
              onStopAll={handleStopAll}
              variables={variables}
              isRunning={isRunning}
            />

            <div className="right-panel">
              <SpritePanel
                sprites={sprites}
                selectedId={selectedId}
                onSelect={handleSelectSprite}
                onAdd={handleAddSprite}
                onRemove={handleRemoveSprite}
              />
            </div>
          </div>

          <div className="workspace-bottom">
            <div className="editor-tabs">
              <button className={`tab ${activeTab === "code" ? "active" : ""}`} onClick={() => setActiveTab("code")}>
                <span className="tab-icon">📝</span>
                Code
              </button>
              <button
                className={`tab ${activeTab === "costumes" ? "active" : ""}`}
                onClick={() => setActiveTab("costumes")}
              >
                <span className="tab-icon">👕</span>
                Costumes
              </button>
              <button
                className={`tab ${activeTab === "sounds" ? "active" : ""}`}
                onClick={() => setActiveTab("sounds")}
              >
                <span className="tab-icon">🔊</span>
                Sounds
              </button>
            </div>

            {activeTab === "code" && (
              <CodeEditor
                activeSprite={activeSprite}
                updateSprite={updateSprite}
                onRunAll={handleRunAll}
                onStopAll={handleStopAll}
                isRunning={isRunning}
                sprites={sprites}
              />
            )}

            {activeTab === "costumes" && (
              <div className="costumes-editor">
                <div className="coming-soon">
                  <h3>🎨 Costumes Editor</h3>
                  <p>Paint and edit sprite costumes</p>
                  <div className="feature-preview">
                    <div className="preview-item">🖌️ Drawing tools</div>
                    <div className="preview-item">🎭 Costume library</div>
                    <div className="preview-item">📸 Upload images</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sounds" && (
              <div className="sounds-editor">
                <div className="coming-soon">
                  <h3>🔊 Sounds Editor</h3>
                  <p>Record and edit sprite sounds</p>
                  <div className="feature-preview">
                    <div className="preview-item">🎤 Record audio</div>
                    <div className="preview-item">🎵 Sound library</div>
                    <div className="preview-item">⚡ Sound effects</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scratch-app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #F2F2F2;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        
        .app-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        
        .main-workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 16px;
          gap: 16px;
        }
        
        .workspace-top {
          display: flex;
          gap: 16px;
          height: 400px;
        }
        
        .right-panel {
          width: 240px;
          display: flex;
          flex-direction: column;
        }
        
        .workspace-bottom {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .editor-tabs {
          display: flex;
          background: #E9EEF2;
          border-bottom: 1px solid #D9D9D9;
        }
        
        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #575E75;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        
        .tab:hover {
          background: rgba(76, 151, 255, 0.1);
        }
        
        .tab.active {
          background: white;
          color: #4C97FF;
          border-bottom-color: #4C97FF;
        }
        
        .tab-icon {
          font-size: 16px;
        }
        
        .costumes-editor,
        .sounds-editor {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .coming-soon {
          text-align: center;
          color: #575E75;
          max-width: 400px;
        }
        
        .coming-soon h3 {
          margin: 0 0 12px 0;
          font-size: 24px;
          font-weight: 600;
        }
        
        .coming-soon p {
          margin: 0 0 24px 0;
          font-size: 16px;
          opacity: 0.8;
        }
        
        .feature-preview {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .preview-item {
          background: #F0F8FF;
          padding: 12px 16px;
          border-radius: 8px;
          border-left: 4px solid #4C97FF;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

export default App
