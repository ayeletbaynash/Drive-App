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
import DownloadFile from '../operations/DownloadFile';
import CopyFile from '../operations/CopyFile';


const FileItem = ({ file, onOpen, isTrash }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Setting permissions from JSON
  const isOwner = file.permission === 'owner';
  const canWrite = isOwner || file.permission === 'write';

  // File type check
  const isTextFile = file.name.toLowerCase().endsWith('.txt');
  const isImageFile = /\.(jpg|jpeg|png)$/i.test(file.name);
  const isPdfFile = file.name.toLowerCase().endsWith('.pdf');

  const closeMenu = () => setIsMenuOpen(false);

  const handleDoubleClick = () => {
    // Logic for fetching content and opening the white page will go here
    if (onOpen) {
      onOpen(file); // Calls the parent function and passes it the file object
    }
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="file-item-container">
      <div className="file-header">
        <span className="file-name">{file.name}</span>
        <div className="menu-wrapper">
          <button onClick={(e) => {e.stopPropagation(); setIsMenuOpen(!isMenuOpen);}}>⋮</button>

          {isMenuOpen && (
            <FloatingMenu onClose={() => closeMenu}>
              <div className="dropdown-content">
                {isTrash ? (
                  <>
                    {/* Only the owner, only in the trash */}
                    {isOwner &&<Restore file={file} onAction={() => closeMenu} />}
                    {isOwner &&<HardDelete file={file} onAction={() => closeMenu} />}
                  </>
                ) : (
                  <>
                    {/* available for all */}
                    <Star file={file} onAction={() => closeMenu} />
                    <DownloadFile file={file} onAction={() => closeMenu} />
                    <CopyFile file={file} onAction={() => closeMenu} />
                    
                    {/* Only the owner */}
                    {isOwner &&<SoftDelete file={file} onAction={() => closeMenu} />}
                    {isOwner &&<Share file={file} onAction={() => closeMenu}/>}
                    
                    {/* Only the owner and writer */}
                    {canWrite &&<Rename file={file} onAction={() => closeMenu}/>}
                  
                    {/* Edit by file type (not PDF) */}
                    {canWrite && isTextFile && (<EditContent file={file} onAction={() => closeMenu} />)} {/*Show text editing only for TXT files*/}
                    {canWrite && isImageFile && (<EditImage file={file} onAction={() => closeMenu} />)} {/*Show image editing only for image files*/}
                    
                  </>
                )}
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