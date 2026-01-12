import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App';
import { useFileActions } from '../FileContext';
import FileItem from '../files/FileItem'
import FileViewer from '../files/FileViewer'


const RecentFiles = ({ onSelectFile }) => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { deletedFiles } = useFileActions();
    const [selectedFile, setSelectedFile] = useState(null); // save the entire file object
    
        // When double click, save the file information.
        const handleOpen = (file) => {
            setSelectedFile(file); 
        };

    const fetchAllFilesRecursive = async (folderId = null) => {
        const url = (folderId === null) 
            ? 'http://localhost:8080/api/files' 
            : `http://localhost:8080/api/files/${folderId}`;

        try {
            const response = await authorizedFetch(url, { method: 'GET' });
            if (!response.ok) return [];
            
            const data = await response.json();
            const items = Array.isArray(data) ? data : (data.children || []);

            const validItems = items.filter(item => !deletedFiles.some(d => d.id === item.id));
            
            const currentLevelFiles = validItems.filter(item => item.type === 'file');
            const currentLevelFolders = validItems.filter(item => item.type === 'folder');

            let allSubFiles = [];
            for (const folder of currentLevelFolders) {
                const subFiles = await fetchAllFilesRecursive(folder.id);
                allSubFiles = [...allSubFiles, ...subFiles];
            }

            return [...currentLevelFiles, ...allSubFiles];
        } catch (error) {
            console.error("Error in recursion:", error);
            return [];
        }
    };

    const onRefresh = async () => {
        setIsLoading(true);
        const allFetchedFiles = await fetchAllFilesRecursive(null);
        setFiles(allFetchedFiles);
        setIsLoading(false);
    };

    useEffect(() => {
        onRefresh();

        const handleRefreshEvent = () => onRefresh();
        window.addEventListener('somthingChange', handleRefreshEvent);

        return () => {
            window.removeEventListener('somthingChange', handleRefreshEvent);
        };
    }, []);

    const sortedFiles = [...files].sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    return (
        <div className="recent-files-page">
            <h1>Recent Files</h1>

            {isLoading ? (
                <div className="loader-container">
                    <p>Loading your recent activity...</p>
                </div>
            ) : sortedFiles.length > 0 ? (
                <div className="files-container">
                    {sortedFiles.map((file) => (<FileItem key={file.id} file={file} onOpen={handleOpen} onSelectFile={onSelectFile}/> ))}
                </div>
            ) : (
                <p>No recent activity found.</p>
            )}
               {/* the modal that will be displayed when there is a file selected */}
            <FileViewer 
                file={selectedFile} 
                show={selectedFile !== null} 
                onHide={() => setSelectedFile(null)} 
            />
        </div>
    );
};

export default RecentFiles;