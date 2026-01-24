import React, { useState, useEffect, useRef } from 'react';
import FileViewList from '../files/FileViewList';
import { useFileActions } from '../FileContext'; 
import { authorizedFetch } from '../../App';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import '../../styles/emptyPages.css';

// SearchFiles component displays the results of a search query.
const SearchFiles = ({results, onSelectFile }) =>{
    const { deletedFiles } = useFileActions();

    const [filteredResults, setFilteredFiles] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    
    // Cache to verify folders quickly without million requests
    const parentStatusCache = useRef(new Map());

    const isUnderDeletedFolder = async (file) => {
        let parentId = file.parent_id;

        while (parentId !== null) {
            if (parentStatusCache.current.has(parentId)) {
                return parentStatusCache.current.get(parentId);
            }

            if (deletedFiles.some(df => df.id === parentId.toString())) {
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
            setIsFiltering(true);
            const safeResults = results || [];
            const validFiles = [];

            for (const file of safeResults) {
                if (deletedFiles.some(deleted => deleted.id === file.id)) {
                    continue;
                }

                if (file.parent_id) {
                    const isDeletedAncestor = await isUnderDeletedFolder(file);
                    if (isDeletedAncestor) continue;
                }

                validFiles.push(file);
            }

            setFilteredFiles(validFiles);
            setIsFiltering(false);
        };

        filterFiles();
        
        parentStatusCache.current.clear();

    }, [results, deletedFiles]);

    return(
        <div className="page-fill-height">
            <h3 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Search Results</h3>
            {isFiltering ? (
                 <LoadingState message="Filtering results..." />
            ) : filteredResults.length === 0 ? (
                <div className="centered-content-wrapper">
                    <EmptyState type="search" />
                </div>
            ) : (
                <FileViewList items={filteredResults} onSelectFile={onSelectFile} />
            )}
        </div>
    );
};


export default SearchFiles;