import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';
import { useNavigate } from 'react-router-dom'
import SoftDelete from '../operations/SoftDelete'
import Star from '../operations/Star'
import Rename from '../operations/Rename'
import Share from '../operations/Share'
import Restore from '../operations/Restore'
import HardDelete from '../operations/HardDelete'
import DownloadFolder from '../operations/DownloadFolder';

const FolderItem = ({ folder, isTrash }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()

  const isOwner = folder.permission === 'owner';
  const canWrite = isOwner || folder.permission === 'write';

  const closeMenu = () => setIsMenuOpen(false);

  const handleDoubleClick = () => {
    if (isTrash) return
    navigate(`/home/${folder.id}`)
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="folder-item-container">
      
      <div className="folder-header">
        <span className="folder-name">{folder.name}</span>
        <div className="menu-wrapper">
          <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen)}}>⋮</button>

          {isMenuOpen && (
            <FloatingMenu onClose={closeMenu}>
              <div className="dropdown-content">
                {isTrash ? (
                  <>
                    {isOwner && <Restore file={folder} onAction={closeMenu} />}
                    {isOwner && <HardDelete file={folder} onAction={closeMenu} />}
                  </>
                ) : (
                  <>
                    <Star file={folder} onAction={closeMenu}/>
                    <DownloadFolder folder={folder} onAction={closeMenu} />

                    {isOwner && <SoftDelete file={folder} onAction={closeMenu}/>}
                    {isOwner && <Rename file={folder} onAction={closeMenu}/>}
                    {canWrite && <Share file={folder} onAction={closeMenu}/>}
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