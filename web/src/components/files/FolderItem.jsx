import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';
import { useNavigate } from 'react-router-dom'

const FolderItem = ({ folder }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()
  const handleDoubleClick = () => {
    navigate(`/home/${folder.id}`)
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="folder-item-container">
      
      <div className="folder-header">
        <span className="folder-name">{folder.name}</span>
        
        <div className="menu-wrapper">
          <button onClick={(e) => {
            e.stopPropagation(); 
            setIsMenuOpen(!isMenuOpen)
          }}>
            ⋮
          </button>

          {isMenuOpen && (
            <FloatingMenu onClose={() => setIsMenuOpen(false)}>
              <div className="dropdown-content">
                <button onClick={() => alert("Deleting...")}>Delete</button>
                <button onClick={() => alert("Renaming...")}>Rename</button>
              </div>
            </FloatingMenu>
          )}
        </div>
      </div>

    </div>
  );
};

export default FolderItem;