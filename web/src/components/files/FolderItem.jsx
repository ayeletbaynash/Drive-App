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

const FolderItem = ({ folder, isTrash }) => {
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
        const response = await authorizedFetch(`http://localhost:8080/api/files/${folder.id}`);
        const data = await response.json();

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = storedUser.id;

        if (data.user_id === currentUserId) {
          setUserPermission('owner');
        } else if (data.permission) {
          setUserPermission(data.permission);
        } else {
          setUserPermission('read');
        }
      } catch (error) {
        console.error("Error fetching folder details:", error);
        setUserPermission('read');
      } finally {
        setIsFetching(false);
      }
    }
  };

  const isOwner = userPermission === 'owner';
  const canWrite = isOwner || userPermission === 'write';

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
          {/* <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen)}}>⋮</button> */}
          <button onClick={handleMenuClick} disabled={isFetching}>{isFetching ? '...' : '⋮'}</button>
          {/* <button onClick={handleMenuClick}>⋮</button> */}

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
};

export default FolderItem;