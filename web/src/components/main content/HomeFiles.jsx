
import React, { useState, useEffect } from 'react';
import FileViewList from '../files/FileViewList';
import { useParams } from 'react-router-dom'
import { authorizedFetch } from '../../App';

const HomeFiles = () => {
    const [files, setFiles] = useState([]);
    const { folderId } = useParams();
    const [currentFolderName, setCurrentFolderName] = useState('');

    const onRefresh = async () => {
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
        }
    }

    useEffect(() => {
    onRefresh();

    const handleRefreshEvent = () => {
        onRefresh();
    };

    window.addEventListener('fileCreated', handleRefreshEvent);
    window.addEventListener('folderCreated', handleRefreshEvent);


    return () => {
        window.removeEventListener('fileCreated', handleRefreshEvent)
        window.removeEventListener('folderCreated', handleRefreshEvent)
    };
}, [folderId]);

    return (
        <div>
            <h1>{currentFolderName}</h1>
            <FileViewList items={files} onRefresh={onRefresh} />
        </div>
    );
}

export default HomeFiles;


