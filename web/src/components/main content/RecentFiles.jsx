import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App';
import { useFileActions } from '../FileContext';
import FileItem from '../files/FileItem'
import FileViewer from '../files/FileViewer'
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import '../../styles/emptyPages.css';


const RecentFiles = ({ onSelectFile }) => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { deletedFiles } = useFileActions();
    const [selectedFile, setSelectedFile] = useState(null); // save the entire file object
    
        // When double click, save the file information.
        const handleOpen = (file) => {
            setSelectedFile(file); 
        };

    // Recursively fetches all files from the server, including those nested in folders.
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

    // Refreshes the file list by triggering the recursive fetch
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

    // Sorts the collected files by their last update timestamp (newest first)
    const sortedFiles = [...files].sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    return (
        <div className="page-fill-height">
            <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Recent Files</h1>

            {/* Display Loading, List, or Empty state based on the current data status */}
            {isLoading ? (
                <LoadingState message="Scanning your recent activity..." />
            ) : sortedFiles.length > 0 ? (
                <div className="files-container">
                    {sortedFiles.map((file) => (<FileItem key={file.id} file={file} onOpen={handleOpen} onSelectFile={onSelectFile}/> ))}
                </div>
            ) : (
                <div className="centered-content-wrapper">
                    <EmptyState type="recent" />
                </div>
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