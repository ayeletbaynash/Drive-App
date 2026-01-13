import React from 'react';
import { useFileActions } from '../FileContext';
import FileViewList from '../files/FileViewList';
import EmptyState from './EmptyState';
import '../../styles/emptyPages.css';

const StarredFiles = ({ onSelectFile }) => {
    // Access starred and deleted files from the file context
    const { starredFiles } = useFileActions()
    const { deletedFiles } = useFileActions();

    /* Filter logic: Display only starred files that are NOT in the recycle bin (deletedFiles) 
       This ensures that if a starred file is deleted, it won't appear here until restored.
    */
    const visibleStarFiles = starredFiles.filter(file => 
    !deletedFiles.some(deletedFile => deletedFile.id === file.id))

    return (
        <div className="page-fill-height">
            <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Starred Files</h1>

            {/* Render the list if filtered results exist, otherwise show the empty state centered on screen */}
            {visibleStarFiles.length > 0 ? (
                <FileViewList items={visibleStarFiles} onSelectFile={onSelectFile}/>
            ) : (
                <div className="centered-content-wrapper">
                    <EmptyState type="starred" />
                </div>
            )}
        </div>
    )
}

export default StarredFiles;