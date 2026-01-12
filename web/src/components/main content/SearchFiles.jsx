import React from 'react';
import FileViewList from '../files/FileViewList';
import { useFileActions } from '../FileContext'; 
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import '../../styles/emptyPages.css';


const SearchFiles = ({results}) =>{
    const { deletedFiles } = useFileActions();
    // Safety check: If results is null/undefined, treat it as an empty array
    const safeResults = results || [];
    
    // Filter out files that have been deleted in the current session
    const visibleResults = safeResults.filter(file => 
        !deletedFiles.some(deleted => deleted.id === file.id)
    );
    return(
        <div className="page-fill-height">
            <h3 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Search Results</h3>
            {visibleResults.length === 0 ? (
                <div className="centered-content-wrapper">
                    <EmptyState type="search" />
                </div>
            ) : (
                // Use existing component to display the filtered file list
                <FileViewList items={visibleResults} />
            )}
        </div>
    );
};


export default SearchFiles;