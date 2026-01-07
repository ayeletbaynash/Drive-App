
import React, { useState, useEffect } from 'react';
import FileViewList from '../files/FileViewList';

const HomeFiles = () => {
    const [files, setFiles] = useState([]);

    const onRefresh = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/files', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setFiles(data.files || data); 
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
    onRefresh();

    const handleRefreshEvent = () => {
        onRefresh();
    };

    window.addEventListener('fileCreated', handleRefreshEvent);

    return () => {
        window.removeEventListener('fileCreated', handleRefreshEvent);
    };
}, []);

    return (
        <div>
            <h1>Home</h1>
            <FileViewList items={files} onRefresh={onRefresh} />
        </div>
    );
};

export default HomeFiles;


