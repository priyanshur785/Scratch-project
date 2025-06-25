"use client"
import { useState } from "react"
import { Plus, X, Eye, EyeOff } from "lucide-react"

export const VariableManager = ({ variables, setVariables, onCreateVariable }) => {
  const [showManager, setShowManager] = useState(false)
  const [newVariableName, setNewVariableName] = useState("")

  const createVariable = () => {
    if (!newVariableName.trim()) return

    const newVariable = {
      id: Date.now(),
      name: newVariableName.trim(),
      value: 0,
      visible: true,
    }

    setVariables((prev) => [...prev, newVariable])
    onCreateVariable && onCreateVariable(newVariable)
    setNewVariableName("")
    setShowManager(false)
  }

  const deleteVariable = (id) => {
    setVariables((prev) => prev.filter((v) => v.id !== id))
  }

  const toggleVisibility = (id) => {
    setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, visible: !v.visible } : v)))
  }

  return (
    <div className="variable-manager">
      <button className="create-variable-btn" onClick={() => setShowManager(true)}>
        <Plus size={16} />
        Make a Variable
      </button>

      {showManager && (
        <div className="variable-modal">
          <div className="modal-content">
            <h3>New Variable</h3>
            <input
              type="text"
              placeholder="Variable name"
              value={newVariableName}
              onChange={(e) => setNewVariableName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createVariable()}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={createVariable} className="create-btn">
                OK
              </button>
              <button onClick={() => setShowManager(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {variables.length > 0 && (
        <div className="variables-list">
          {variables.map((variable) => (
            <div key={variable.id} className="variable-item">
              <button
                onClick={() => toggleVisibility(variable.id)}
                className="visibility-btn"
                title={variable.visible ? "Hide variable" : "Show variable"}
              >
                {variable.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>

              <span className="variable-name">{variable.name}</span>

              <button onClick={() => deleteVariable(variable.id)} className="delete-btn" title="Delete variable">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .variable-manager {
          margin-top: 16px;
        }
        
        .create-variable-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FF8C1A;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          width: 100%;
          justify-content: center;
        }
        
        .create-variable-btn:hover {
          background: #E67E00;
        }
        
        .variable-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          min-width: 300px;
        }
        
        .modal-content h3 {
          margin: 0 0 16px 0;
          color: #575E75;
        }
        
        .modal-content input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #D9D9D9;
          border-radius: 4px;
          font-size: 14px;
          margin-bottom: 16px;
        }
        
        .modal-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        
        .create-btn {
          background: #4C97FF;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .cancel-btn {
          background: #E9EEF2;
          color: #575E75;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .variables-list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .variable-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          background: rgba(255, 140, 26, 0.1);
          border-radius: 4px;
        }
        
        .visibility-btn, .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 2px;
          border-radius: 2px;
        }
        
        .visibility-btn:hover, .delete-btn:hover {
          background: rgba(0,0,0,0.1);
        }
        
        .variable-name {
          flex: 1;
          font-size: 12px;
          color: #575E75;
        }
      `}</style>
    </div>
  )
}

export const VariableDisplay = ({ variables, sprites }) => {
  const visibleVariables = variables.filter((v) => v.visible)

  if (visibleVariables.length === 0) return null

  return (
    <div className="variable-display">
      {visibleVariables.map((variable) => (
        <div key={variable.id} className="variable-monitor">
          <div className="variable-label">{variable.name}</div>
          <div className="variable-value">{variable.value}</div>
        </div>
      ))}

      <style jsx>{`
        .variable-display {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 10;
        }
        
        .variable-monitor {
          background: rgba(255, 140, 26, 0.9);
          color: white;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          min-width: 80px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .variable-label {
          font-size: 10px;
          opacity: 0.9;
          margin-bottom: 2px;
        }
        
        .variable-value {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}
