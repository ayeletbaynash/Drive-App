
import React, { useState, useEffect } from 'react';
import FileViewList from '../files/FileViewList';
import { useParams } from 'react-router-dom'
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState'; // ייבוא של רכיב הטעינה החדש
import '../../styles/emptyPages.css';


/**
 * MyDriveFiles component manages the main personal storage view.
 * It handles folder navigation and displays only the current user's active files.
 */
const MyDriveFiles = () => {
    const [files, setFiles] = useState([]);
    const { folderId } = useParams();
    const [currentFolderName, setCurrentFolderName] = useState('');
    const { deletedFiles } = useFileActions()
    const [isLoading, setIsLoading] = useState(true);
const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;
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

    // Re-run fetch whenever the folderId changes or a custom refresh event is triggered
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
        file.user_id == currentUserId && !deletedFiles.some(d => d.id === file.id))


return (
        <div className="page-fill-height">
            {/* Page Header showing the current location */}
            <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{currentFolderName}</h1>
             {isLoading ? (
            <LoadingState message="Loading your files..." />
        ) : myVisibleFiles.length > 0 ? (
            <FileViewList items={myVisibleFiles} />
        ) : (
            <div className="centered-content-wrapper">
                    <EmptyState type="drive" />
                </div>
        )}
    </div>
    );
}

export default MyDriveFiles;


