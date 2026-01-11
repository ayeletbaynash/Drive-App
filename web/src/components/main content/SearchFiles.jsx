import React from 'react';
import FileViewList from '../files/FileViewList';
import { useFileActions } from '../FileContext'; 

const SearchFiles = ({results}) =>{
    const { deletedFiles } = useFileActions();
    // Safety check: If results is null/undefined, treat it as an empty array
    const safeResults = results || [];
    // Filter out files that have been deleted in the current session
    const visibleResults = safeResults.filter(file => 
        !deletedFiles.some(deleted => deleted.id === file.id)
    );
    return(
        <div>
            <h3>Search Results</h3>
            {visibleResults.length === 0 ? (
                <p>No files found matching your search.</p>
            ) : (
                // Use existing component to display the filtered file list
                <FileViewList items={visibleResults} />
            )}
        </div>
    );
};


export default SearchFiles;