import React, { useState, useRef } from 'react';
import { authorizedFetch } from '../../App';
import { Spinner, Button } from 'react-bootstrap';
import { useFileActions } from '../FileContext';
import '../../styles/operations.css';

const DownloadFolder = ({ folder, onAction }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isCancelled = useRef(false);
    
    // Access the list of deleted files from your Context
    const { deletedFiles } = useFileActions();

    // Downloads a single file content and handles the blob creation
    const downloadSingleFile = async (id, name) => {
        if (isCancelled.current) return;
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${id}`);
            const data = await response.json();

            if (response.ok && data.content) {
                const link = document.createElement('a');
                // Use data URI if available, otherwise create a Blob URL
                link.href = data.content.startsWith('data:') 
                    ? data.content 
                    : window.URL.createObjectURL(new Blob([data.content], { type: 'text/plain' }));
                
                link.download = data.content.startsWith('data:') ? name : `${name}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Cleanup the temporary URL
                if (!data.content.startsWith('data:')) {
                    window.URL.revokeObjectURL(link.href);
                }
            }
        } catch (error) {
            console.error(`Download failed for: ${name}`, error);
        }
    };

    // Scans folders recursively and filters out deleted files based on local state
    const processFolder = async (folderId, visited = new Set()) => {
    if (isCancelled.current) return;
    if (visited.has(String(folderId))) return;
    visited.add(String(folderId));

    try {
        // We use the specific folder endpoint because your backend 
        // returns 'children' only in this specific route.
        const response = await authorizedFetch(`http://localhost:8080/api/files/${folderId}`, {
            cache: 'no-store'
        });
        const data = await response.json();

        // Safety check: ensure we have children to process
        const allItems = data.children || [];

        // FILTER LOGIC:
        // We only care if the item is NOT in the local deletedFiles list.
        const itemsToProcess = allItems.filter(item => {
            const isDeleted = deletedFiles.some(d => String(d.id) === String(item.id));
            return !isDeleted;
        });

        for (const item of itemsToProcess) {
            if (isCancelled.current) break;

            // In your backend, folders are identified by type === 'folder'
            if (item.type === 'folder') {
                await processFolder(item.id, visited);
            } else {
                // It's a file and not deleted - download it
                await downloadSingleFile(item.id, item.name);
                // Delay to prevent the browser from blocking multiple downloads
                await new Promise(r => setTimeout(r, 700));
            }
        }
    } catch (error) {
        console.error(`Error processing folder ${folderId}:`, error);
    }
};

    const handleFolderDownload = async (e) => {
        e.stopPropagation();
        if (isLoading) return;

        setIsLoading(true);
        isCancelled.current = false;

        try {
            await processFolder(folder.id); 
            if (onAction) onAction();
        } catch (error) {
            console.error("Recursive download error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        isCancelled.current = true;
        setIsLoading(false);
    };

    return (
        <button 
            className="operation-button" 
            onClick={handleFolderDownload}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <i className="bi bi-arrow-repeat spin-icon"></i>
                    <span>Downloading...</span>
                </>
            ) : (
                <>
                    <i className="bi bi-download"></i>
                    <span>Download Folder</span>
                </>
            )}
        </button>
    );
};

export default DownloadFolder;