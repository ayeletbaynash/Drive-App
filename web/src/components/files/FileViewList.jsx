import React, { useState } from 'react';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import FileViewer from './FileViewer'
import '../../styles/FileViewList.css';

const FileViewList = ({items, isTrash, onSelectFile}) =>{
    const folders = items.filter(item => item.type === 'folder');
    const files = items.filter(item => item.type === 'file');
    const [selectedFile, setSelectedFile] = useState(null); // save the entire file object

    // When double click, save the file information.
    const handleOpen = (file) => {
        setSelectedFile(file); 
    };

return (
    <div className="file-list-container">
      <section className="section">
        <h2 className="section-title">Folders</h2>
        <div className="folders-grid">
          {folders.map(f => (
            <FolderItem key={f.id} folder={f} isTrash={isTrash} onSelectFile={onSelectFile} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Files</h2>
        
        <div className="file-list-header">
          <span className="col-name">Name</span>
          <span className="col-owner">Owner</span>
          <span className="col-date">Last Modified</span>
        </div>

        <div className="files-list">
          {files.map(f => (
            <FileItem 
              key={f.id} 
              file={f} 
              onOpen={handleOpen}
              isTrash={isTrash}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      </section>
      <FileViewer 
        file={selectedFile} 
        show={selectedFile !== null} 
        onHide={() => setSelectedFile(null)} 
      />
    </div>
  );
}
export default FileViewList;
