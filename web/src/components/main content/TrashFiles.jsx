import React from 'react';
import { useFileActions } from '../FileContext';
import FileViewList from '../files/FileViewList';
import EmptyState from './EmptyState';
import '../../styles/emptyPages.css';

const TrashFiles = () => {
    const { deletedFiles } = useFileActions();

        return (
            <div className="page-fill-height">
                <h1 className="mb-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Recycle Bin</h1>
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
