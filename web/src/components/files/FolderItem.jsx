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
import { authorizedFetch } from '../../App';
import '../../styles/FileItem.css';

import { authorizedFetch } from '../../App'; 
import '../../styles/operations.css';

const FolderItem = ({ folder, onOpen, isTrash, onSelectFile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userPermission, setUserPermission] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate()

  const handleMenuClick = async (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    
    if (!isMenuOpen && userPermission === null) {
      setIsFetching(true);
      try {
        const response = await authorizedFetch(`http://localhost:8080/api/files/${folder.id}/permissions`);
        const permissionsList = await response.json();
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = storedUser.id;
        const myPermissionEntry = permissionsList.find(p => p.userID === currentUserId);
        
        setUserPermission(myPermissionEntry.permission);
        } catch (error) {
        console.error("Error fetching folder permissions:", error);
        setUserPermission('read');
      } finally {
        setIsFetching(false);
      }
    }
  }   

  const isOwner = userPermission === 'owner';
  const canWrite = isOwner || userPermission === 'write';

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
        <button className="menu-btn" onClick={handleMenuClick} disabled={isFetching}>
          {isFetching ? '...' : '⋮'}
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
                {userPermission && (
                  <>
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

        {isMenuOpen && (
          <FloatingMenu onClose={closeMenu}>
            <div className="dropdown-content">
              {userPermission && (
                <>
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
                      {isOwner && <SoftDelete file={folder} onAction={closeMenu} />}
                      {isOwner && <Rename file={folder} onAction={closeMenu} />}
                      {canWrite && <Share file={folder} onAction={closeMenu} />}
                    </>
                  )}
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