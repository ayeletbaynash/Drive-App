import React from 'react';
import { useFileActions } from '../FileContext';
import FileViewList from '../files/FileViewList';

const StarredFiles = () => {
    const { starredFiles } = useFileActions()
    const { deletedFiles } = useFileActions();
    const visibleStarFiles = starredFiles.filter(file => 
    !deletedFiles.some(deletedFile => deletedFile.id === file.id))

    return (
        <div>
            <h1>Starred Files</h1>
            {visibleStarFiles.length > 0 ? (
                <FileViewList items={visibleStarFiles} />
            ) : (
                <div>
                    <p>No starred files yet.</p>
                </div>
            )}
        </div>
    )
}

export default StarredFiles;