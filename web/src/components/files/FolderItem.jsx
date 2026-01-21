import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';
import { useNavigate } from 'react-router-dom'
import SoftDelete from '../operations/SoftDelete'
import Star from '../operations/Star'
import Rename from '../operations/Rename'
import Share from '../operations/Share'
import Restore from '../operations/Restore'
import HardDelete from '../operations/HardDelete'
import DownloadFolder from '../operations/DownloadFolder'
import MoveFile from '../operations/MoveFile'
import '../../styles/FileItem.css';

const FolderItem = ({ folder, onOpen, isTrash, onSelectFile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Read permission directly from the folder object 
  const userPermission = folder.permission || 'read'; 
  const isOwner = userPermission === 'owner';
  const canWrite = isOwner || userPermission === 'write';

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  }   

  const closeMenu = () => setIsMenuOpen(false);

  const handleDoubleClick = () => {
    if (isTrash) return
    navigate(`/home/${folder.id}`)
  };

  return (
  <div onDoubleClick={handleDoubleClick} className="file-item-row folder-item">
    {/* Folder Name & Icon */}
    <div className="col-name">
      <i className="bi bi-folder-fill folder-icon"></i>
      <span className="file-name-text">{folder.name}</span>
    </div>

    {/* Date & Menu Button */}
    <div className="col-date">
      <div className="menu-wrapper">
        <button className="menu-btn" onClick={handleMenuClick}>
          ⋮
        </button>
          {isMenuOpen && (
            <FloatingMenu onClose={closeMenu}>
              <div className="dropdown-content">
                <button 
                  className="operation-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFile(folder); 
                    closeMenu();        
                  }}
                >
                  <i className="bi bi-info-circle"></i>
                  <span>Details</span>
                </button>
                
                  {isTrash ? (
                    <>
                      {isOwner && <Restore file={folder} onAction={closeMenu} />}
                      {isOwner && <HardDelete file={folder} onAction={closeMenu} />}
                    </>
                  ) : (
                    <>
                      <Star file={folder} onAction={closeMenu} />
                      <DownloadFolder folder={folder} onAction={closeMenu} />
                      <MoveFile file={folder} onAction={closeMenu} />

                      {/* --- BUTTONS NOW VISIBLE BASED ON DB --- */}
                      {isOwner && <SoftDelete file={folder} onAction={closeMenu} />}
                      {isOwner && <Rename file={folder} onAction={closeMenu} />}
                      {canWrite && <Share file={folder} onAction={closeMenu} />}
                    </>
                  )}
              </div>
            </FloatingMenu>
          )}
      </div>
    </div>
  </div>
);
}
export default FolderItem;