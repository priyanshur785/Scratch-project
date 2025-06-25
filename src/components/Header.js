"use client"
import { Globe, Folder, Edit3, Share, HelpCircle } from "lucide-react"

const Header = () => {
  return (
    <header className="scratch-header">
      <div className="header-left">
        <div className="scratch-logo">
          <div className="logo-icon">🐱</div>
          <span className="logo-text">Scratch</span>
        </div>

        <nav className="main-nav">
          <button className="nav-item">
            <Globe size={16} />
            <span>Language</span>
          </button>
          <button className="nav-item">
            <Folder size={16} />
            <span>File</span>
          </button>
          <button className="nav-item">
            <Edit3 size={16} />
            <span>Edit</span>
          </button>
          <button className="nav-item">
            <HelpCircle size={16} />
            <span>Tutorials</span>
          </button>
        </nav>
      </div>

      <div className="header-center">
        <input type="text" placeholder="Untitled" className="project-name" />
      </div>

      <div className="header-right">
        <button className="share-button">
          <Share size={16} />
          <span>Share</span>
        </button>
        <button className="profile-button">
          <div className="avatar">👤</div>
        </button>
      </div>

      <style jsx>{`
        .scratch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(90deg, #4C97FF 0%, #9966FF 100%);
          color: white;
          padding: 0 16px;
          height: 56px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .scratch-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          font-size: 20px;
        }
        
        .logo-icon {
          font-size: 24px;
        }
        
        .main-nav {
          display: flex;
          gap: 4px;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }
        
        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 300px;
        }
        
        .project-name {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 16px;
          text-align: center;
          width: 100%;
          max-width: 200px;
        }
        
        .project-name::placeholder {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .project-name:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.3);
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .share-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FF6B35;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .share-button:hover {
          background: #E55A2B;
        }
        
        .profile-button {
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .avatar {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
      `}</style>
    </header>
  )
}

export default Header
