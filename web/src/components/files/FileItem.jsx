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



const FileItem = ({ file, onOpen, isTrash }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // differentiate between image and text
  const isTextFile = file.type === 'file' && file.name.toLowerCase().endsWith('.txt');
  const isImageFile = file.type === 'file' && /\.(jpg|jpeg|png)$/i.test(file.name);

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
          <button onClick={(e) => {
            e.stopPropagation(); 
            setIsMenuOpen(!isMenuOpen);
          }}>
            ⋮
          </button>

          {isMenuOpen && (
            <FloatingMenu onClose={() => setIsMenuOpen(false)}>
              <div className="dropdown-content">
                {isTrash ? (
                  <>
                    <Restore file={file} onAction={() => setIsMenuOpen(false)} />
                    <HardDelete file={file} onAction={() => setIsMenuOpen(false)} />
                  </>
                ) : (
                  <>
                    <SoftDelete file={file} onAction={() => setIsMenuOpen(false)} />
                    <Star file={file} onAction={() => setIsMenuOpen(false)} />
                    <Rename file={file} onAction={() => setIsMenuOpen(false)}/>
                    <DownloadFile file={file} onAction={() => setIsMenuOpen(false)} />
                    <Share file={file} onAction={() => setIsMenuOpen(false)}/>
                    {isTextFile && (<EditContent file={file} onAction={() => setIsMenuOpen(false)} />)} {/*Show text editing only for TXT files*/}
                    {isImageFile && (<EditImage file={file} onAction={() => setIsMenuOpen(false)} />)} {/*Show image editing only for image files*/}
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