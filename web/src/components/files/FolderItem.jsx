import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';
import { useNavigate } from 'react-router-dom'
import SoftDelete from '../operations/SoftDelete'
import Star from '../operations/Star'
import Rename from '../operations/Rename'
import Restore from '../operations/Restore'
import HardDelete from '../operations/HardDelete'
import DownloadFolder from '../operations/DownloadFolder';




const FolderItem = ({ folder, isTrash }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()
  const handleDoubleClick = () => {
    if (isTrash) return
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
                {isTrash ? (
                  <>
                    <Restore file={folder} onAction={() => setIsMenuOpen(false)} />
                    <HardDelete file={folder} onAction={() => setIsMenuOpen(false)} />
                  </>
                ) : (
                  <>
                    <SoftDelete file={folder} onAction={() => setIsMenuOpen(false)}/>
                    <Star file={folder} onAction={() => setIsMenuOpen(false)}/>
                    <Rename file={folder} onAction={() => setIsMenuOpen(false)}/>
                    <DownloadFolder folder={folder} onAction={() => setIsMenuOpen(false)} />
                  </>
                )}
              </div>
            </FloatingMenu>
          )}
        </div>
      </div>

    </div>
  );
};

export default FolderItem;