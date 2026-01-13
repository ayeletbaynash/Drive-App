
import React, { useState, useEffect } from 'react';
import FileViewList from '../files/FileViewList';
import { useParams } from 'react-router-dom'
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext';
import EmptyState from './EmptyState';
import '../../styles/emptyPages.css';
import LoadingState from './LoadingState';


const SharedWithMe = ({ onSelectFile }) => {
    const [files, setFiles] = useState([]);
    const { folderId } = useParams();
    const [currentFolderName, setCurrentFolderName] = useState('');
    const { deletedFiles } = useFileActions()
    const [isLoading, setIsLoading] = useState(true);

    // Retrieve current user ID from local storage for filtering purposes
    const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;

    /**
     * Fetches files from the server.
     * Handles both the root shared directory and specific folder navigation.
     */
    const onRefresh = async () => {
        setIsLoading(true)
        try {
            let url
            if (folderId) {
                url = `http://localhost:8080/api/files/${folderId}`
            } else {
                url = 'http://localhost:8080/api/files'
            }
            const response = await authorizedFetch(url, {
                method: 'GET'
            });
            const data = await response.json()
            if (folderId) {
                setFiles(data.children || [])
                setCurrentFolderName(data.name)
            } else {
                setFiles(data.files || data)
                setCurrentFolderName('My Drive')
            }
        } catch (error) {
            console.error(error);
        } finally {
        setIsLoading(false)
        }
    }

    // Set up lifecycle and custom event listeners for refreshing the file list
    useEffect(() => {
    onRefresh();

    const handleRefreshEvent = () => {
        onRefresh();
    };

    window.addEventListener('somthingChange', handleRefreshEvent);

    
    return () => {
        window.removeEventListener('somthingChange', handleRefreshEvent)
        };
}, [folderId]);


    const myVisibleFiles = files.filter(file =>
        file.user_id !== currentUserId && !deletedFiles.some(d => d.id === file.id))


return (
        <div className="page-fill-height">
            <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{currentFolderName}</h1>

            {/* View State Management: Loading -> Content -> Empty */}
             {isLoading ? (
                <LoadingState message="Fetching your shared files..." />
        ) : myVisibleFiles.length > 0 ? (
            <FileViewList items={myVisibleFiles} onSelectFile={onSelectFile} />
        ) : (
            <div className="centered-content-wrapper">
                    <EmptyState type="shared" />
                </div>
        )}
    </div>
    );
}

export default SharedWithMe


