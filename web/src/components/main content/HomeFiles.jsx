
import React, { useState, useEffect } from 'react';
import FileViewList from '../files/FileViewList';
import { useParams } from 'react-router-dom'
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import '../../styles/emptyPages.css';


const HomeFiles = () => {
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { folderId } = useParams();
    const [currentFolderName, setCurrentFolderName] = useState('');
    const { deletedFiles } = useFileActions();

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
                setCurrentFolderName('Home')
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


    const visibleFiles = files.filter(file => 
    !deletedFiles.some(deletedFile => deletedFile.id === file.id))

return (
        <div className="page-fill-height">
            <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{currentFolderName}</h1>
            {isLoading ? (
                <LoadingState message="Fetching your files..." />
            ) : visibleFiles.length > 0 ? (
                <FileViewList items={visibleFiles} />
            ) : (
                <div className="centered-content-wrapper">
                    <EmptyState type="home" />
                </div>
            )}
        </div>
    );
}

export default HomeFiles;


