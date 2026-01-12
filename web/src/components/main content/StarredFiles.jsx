import React from 'react';
import { useFileActions } from '../FileContext';
import FileViewList from '../files/FileViewList';
import EmptyState from './EmptyState';
import '../../styles/emptyPages.css';

const StarredFiles = () => {
    const { starredFiles } = useFileActions()
    const { deletedFiles } = useFileActions();
    const visibleStarFiles = starredFiles.filter(file => 
    !deletedFiles.some(deletedFile => deletedFile.id === file.id))

    return (
        <div className="page-fill-height">
            <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Starred Files</h1>
            {visibleStarFiles.length > 0 ? (
                <FileViewList items={visibleStarFiles} />
            ) : (
                <div className="centered-content-wrapper">
                    <EmptyState type="starred" />
                </div>
            )}
        </div>
    )
}

export default StarredFiles;