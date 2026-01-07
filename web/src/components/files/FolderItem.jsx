import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';

const FolderItem = ({ file, onRefresh }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDoubleClick = () => {
    // Logic for fetching content and opening the white page will go here
    alert("Opening folder: " + file.name);
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="folder-item-container">
      
      <div className="folder-header">
        <span className="folder-name">{file.name}</span>
        
        <div className="menu-wrapper">
          <button onClick={(e) => {
            e.stopPropagation(); 
            setIsMenuOpen(!isMenuOpen);
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