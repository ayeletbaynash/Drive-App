import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';
import { useNavigate } from 'react-router-dom'
import SoftDelete from '../operations/SoftDelete'
import Star from '../operations/Star'


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
                <SoftDelete file={folder} />
                <Star file={folder} onAction={() => setIsMenuOpen(false)}/>
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