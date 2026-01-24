import React, { useState } from 'react';
import FloatingMenu from '../FloatingMenu';
import SoftDelete from '../operations/SoftDelete'
import Star from '../operations/Star'
import EditContent from '../operations/EditContent'
import Rename from '../operations/Rename'
import EditImage from '../operations/EditImage';
import Share from '../operations/Share'
import Restore from '../operations/Restore'
import HardDelete from '../operations/HardDelete'
import DownloadFile from '../operations/DownloadFile'
import MoveFile from '../operations/MoveFile'
import CopyFile from '../operations/CopyFile'
import '../../styles/FileItem.css';
import { useFileActions } from '../FileContext';

const FileItem = ({ file, onOpen, isTrash, onSelectFile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userPermission = file.permission || 'read'; // Default to read if missing
  const isOwner = userPermission === 'owner';
  const canWrite = isOwner || userPermission === 'write';
  
  // Logic for "Owner" column display
  const ownerDisplay = isOwner ? 'Me' : (file.ownerName || 'External'); 

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);

  // File type check
  const isTextFile = file.name.toLowerCase().endsWith('.txt');
  const isImageFile = /\.(jpg|jpeg|png)$/i.test(file.name);
  const isPdfFile = file.name.toLowerCase().endsWith('.pdf');

  const handleDoubleClick = () => {
    if (onOpen) onOpen(file); 
  };

  const { starredFiles } = useFileActions();
  const isStarred = starredFiles.some(f => f.id === file.id);

  // For design
  let fileCategory = 'generic'
  if (isImageFile) fileCategory = 'image'
  else if (isPdfFile) fileCategory = 'pdf'
  else if (isTextFile) fileCategory = 'text'

  return (
    <div onDoubleClick={handleDoubleClick} className="file-item-row">
      <div className="col-name">
        <i className={`bi file-icon icon-${fileCategory} ${
            fileCategory === 'image' ? 'bi-image' : 
            fileCategory === 'pdf' ? 'bi-file-earmark-pdf-fill' : 
            'bi-file-earmark-text'
          }`}></i>
          {isStarred && (
            <i className="bi bi-star-fill" style={{ color: '#ffc107', marginRight: '8px' }}></i>
          )}
        <span className="file-name-text">{file.name}</span>
      </div>

      <div className="col-owner">
        <span className="owner-badge">{ownerDisplay}</span>
      </div>

      <div className="col-date">
        <span className="date-text">
          {file.updated_at 
              ? new Date(file.updated_at).toLocaleString('he-IL', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: false 
                }) 
              : 'Today'}
        </span>
        
        <div className="menu-wrapper">
          <button className="menu-btn" onClick={handleMenuClick}>⋮</button>

          {isMenuOpen && (
            <FloatingMenu onClose={closeMenu}>
              <div className="dropdown-content">
                <button 
                  className="operation-button" 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onSelectFile(file);  
                    closeMenu();         
                  }}
                >
                  <i className="bi bi-info-circle"></i>
                  <span>Details</span>
                </button>
                
                {isTrash ? (
                  <>
                    {/* Only the owner can restore/hard delete */}
                    {isOwner && <Restore file={file} onAction={closeMenu} />}
                    {isOwner && <HardDelete file={file} onAction={closeMenu} />}
                  </>
                ) : (
                  <>
                    <Star file={file} onAction={closeMenu} />
                    <DownloadFile file={file} onAction={closeMenu} />
                    <CopyFile file={file} onAction={closeMenu} />
                    <MoveFile file={file} onAction={closeMenu}/>
                    
                    {/* BUTTONS ARE NOW CONTROLLED BY PROP DATA */}
                    {isOwner && <SoftDelete file={file} onAction={closeMenu} />}
                    {isOwner && <Share file={file} onAction={closeMenu}/>}
                    
                    {/* Write permission allows renaming */}
                    {canWrite && <Rename file={file} onAction={closeMenu}/>}
                  
                    {/* Edit content */}
                    {canWrite && isTextFile && (<EditContent file={file} onAction={closeMenu} />)} 
                    {canWrite && isImageFile && (<EditImage file={file} onAction={closeMenu} />)}
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

export default FileItem;