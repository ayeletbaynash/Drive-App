import React, { useState } from 'react';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import FileViewer from './FileViewer';

const FileViewList = ({items, onRefresh}) =>{
    const folders = items.filter(item => item.type === 'folder');
    const files = items.filter(item => item.type === 'file');
    const [selectedFile, setSelectedFile] = useState(null); // save the entire file object

    // When double click, save the file information.
    const handleOpen = (file) => {
        setSelectedFile(file.id); 
    };

    return(
        <div>
            <h2>folders</h2>
            <div>
                {folders.map(f => (
                    <FolderItem folder={f} onRefresh={onRefresh} />
                ))}
            </div>
            <h2>files</h2>
            <div>
                {files.map(f => (
                    <FileItem 
                        key={f.id} 
                        file={f} 
                        onRefresh={onRefresh} 
                        onOpen={handleOpen}
                    />
                ))}
            </div>
            {/* the modal that will be displayed when there is a file selected */}
            <FileViewer 
                file={selectedFile} 
                show={selectedFile !== null} 
                onHide={() => setSelectedFile(null)} 
            />
        </div>
    );

};

export default FileViewList;