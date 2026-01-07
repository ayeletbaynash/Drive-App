import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';

const FileItem = ({ file, onRefresh }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDoubleClick = () => {
    // Logic for fetching content and opening the white page will go here
    if (onOpen) {
      onOpen(file); // Calls the parent function and passes it the file object
    }
    alert("Opening file: " + file.name);
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="file-item-container">
      
      <div className="file-header">
        <span className="file-name">{file.name}</span>
        
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

      {/* The content preview area is currently empty/removed */}
      <div className="file-body">
      </div>

    </div>
  );
};

export default FileItem;