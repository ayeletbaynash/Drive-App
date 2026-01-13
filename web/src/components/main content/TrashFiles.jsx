import React from 'react';
import { useFileActions } from '../FileContext';
import FileViewList from '../files/FileViewList';
import EmptyState from './EmptyState';
import '../../styles/emptyPages.css';

const TrashFiles = () => {
    // Access the list of deleted files from the global file context
    const { deletedFiles } = useFileActions();

        return (
            <div className="page-fill-height">
                <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Recycle Bin</h1>

                {/* Conditional Rendering: Show the list if there are deleted files, otherwise show the empty state */}
                {deletedFiles.length > 0 ? (
                    <FileViewList items={deletedFiles} isTrash={true}/>
                ) : (
                    <div className="centered-content-wrapper">
                    <EmptyState type="trash" />
                </div>
                )}
            </div>
        );
    };

export default TrashFiles;
