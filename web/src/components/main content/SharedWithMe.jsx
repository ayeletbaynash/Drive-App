
import React, { useState, useEffect } from 'react';
import FileViewList from '../files/FileViewList';
import { useParams } from 'react-router-dom'
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext';

const SharedWithMe = () => {
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
        <div>
            <h1>{currentFolderName}</h1>
             {isLoading ? (
            <div className="loader-container">
                    <p>Loading files...</p> 
                </div>
        ) : myVisibleFiles.length > 0 ? (
            <FileViewList items={myVisibleFiles} />
        ) : (
            <p>Your drive is empty.</p>
        )}
    </div>
    );
}

export default SharedWithMe


