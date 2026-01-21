import React, { useState, useEffect, useRef } from 'react';
import { useFileActions } from '../FileContext';
import FileViewList from '../files/FileViewList';
import EmptyState from './EmptyState';
import { authorizedFetch } from '../../App';
import LoadingState from './LoadingState'; 
import '../../styles/emptyPages.css';

const StarredFiles = ({ onSelectFile }) => {
    // Access starred and deleted files from the file context
    const { starredFiles, deletedFiles } = useFileActions()
    const [visibleFiles, setVisibleFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const parentStatusCache = useRef(new Map());

    const isUnderDeletedFolder = async (file) => {
        let parentId = file.parent_id;

        while (parentId !== null) {
            if (parentStatusCache.current.has(parentId)) {
                return parentStatusCache.current.get(parentId);
            }

            if (deletedFiles.some(df => df.id.toString() === parentId.toString())) {
                parentStatusCache.current.set(parentId, true);
                return true;
            }

            try {
                const response = await authorizedFetch(`http://localhost:8080/api/files/${parentId}`, { method: 'GET' });
                if (!response.ok) {
                    parentStatusCache.current.set(parentId, true);
                    return true;
                }

                const parent = await response.json();
                parentId = parent.parent_id; 

            } catch (e) {
                parentStatusCache.current.set(parentId, false);
                return false;
            }
        }
        return false; 
    };

    useEffect(() => {
        const filterFiles = async () => {
            setIsLoading(true);
            const validFiles = [];

            for (const file of starredFiles) {
                if (deletedFiles.some(d => d.id === file.id)) {
                    continue; 
                }

                if (file.parent_id && deletedFiles.some(d => d.id.toString() === file.parent_id.toString())) {
                    continue;
                }

                if (file.parent_id) {
                    const isDeepDeleted = await isUnderDeletedFolder(file);
                    if (isDeepDeleted) continue;
                }

                validFiles.push(file);
            }

            setVisibleFiles(validFiles);
            setIsLoading(false);
        };

        filterFiles();
        parentStatusCache.current.clear();

    }, [starredFiles, deletedFiles]);

    return (
        <div className="page-fill-height">
            <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Starred Files</h1>

            {/* Render the list if filtered results exist, otherwise show the empty state centered on screen */}
            {isLoading ? (
                <LoadingState message="Loading your starred files..." />
            ) : visibleFiles.length > 0 ? (
                <FileViewList items={visibleFiles} onSelectFile={onSelectFile}/>
            ) : (
                <div className="centered-content-wrapper">
                    <EmptyState type="starred" />
                </div>
            )}
        </div>
    )
}

export default StarredFiles;