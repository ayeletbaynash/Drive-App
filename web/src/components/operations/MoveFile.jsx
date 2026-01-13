import { useState } from "react";
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext'
import '../../styles/operations.css';

const MoveFile = ({ file, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [allFolders, setAllFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { deletedFiles } = useFileActions();
    const [selectedFolderId, setSelectedFolderId] = useState(undefined);

    const fetchFoldersRecursive = async (folderId) => {
        const url = (folderId === null) 
            ? 'http://localhost:8080/api/files' 
            : `http://localhost:8080/api/files/${folderId}`;

        try {
            const response = await authorizedFetch(url, { method: 'GET' });
            if (!response.ok) return [];
            
            const data = await response.json();
            const items = Array.isArray(data) ? data : (data.children || []);
            const validFolders = items.filter(item => 
                item.type === 'folder' && 
                !deletedFiles.some(d => d.id === item.id)
            );
            
            let foundFolders = [...validFolders];
            for (const folder of validFolders) {
                if (folder.id === file.id) {
                continue 
            }
                const subFolders = await fetchFoldersRecursive(folder.id);
                foundFolders = [...foundFolders, ...subFolders];
            }
            return foundFolders;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const handleOpenModal = async (e) => {
        e.stopPropagation();
        setIsOpen(true);
        setIsLoading(true);
        setSelectedFolderId(undefined);
        
        const folders = await fetchFoldersRecursive(null);
        const foldersWithoutMe = folders.filter(f => f.id !== file.id && f.id !== file.parent_id);
        
        setAllFolders([{ id: null, name: "Main Drive (Root)" }, ...foldersWithoutMe]);
        setIsLoading(false);
    };

    const executeMove = async (targetFolderId) => {
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parent_id: targetFolderId })
            });

            if (response.ok) {
                alert(`Moved ${file.name} successfully!`);
                setIsOpen(false);
                if (onAction) onAction();
                window.dispatchEvent(new Event('somthingChange'));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmClick = () => {
        if (selectedFolderId === undefined) {
            alert("Please select a destination folder first!");
            return;
        }
        executeMove(selectedFolderId);
    };

    return (
        <>
            <button className="operation-button" onClick={handleOpenModal}>
                <i className="bi bi-folder-symlink"></i>
                <span>Move To</span>
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content move-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-confirm">
                            <h3>Move "{file.name}"</h3>
                        </div>

                        {isLoading ? (
                            <div className="loading-spinner">
                                <p>Scanning folders...</p>
                            </div>
                        ) : (
                            <>
                                <div className="folder-selection-list">
                                    {allFolders.map((folder) => (
                                        <div 
                                            key={folder.id} 
                                            className={`folder-option ${selectedFolderId === folder.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedFolderId(folder.id)}
                                        >
                                            <i className={`bi ${folder.id === null ? 'bi-hdd-rack' : 'bi-folder'}`}></i>
                                            <span className="folder-option-name">{folder.name}</span>
                                            {selectedFolderId === folder.id && <i className="bi bi-check-circle-fill select-check"></i>}
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
                                    <button 
                                        className="btn-primary" 
                                        onClick={() => executeMove(selectedFolderId)}
                                        disabled={selectedFolderId === undefined}
                                    >
                                        Confirm Move
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MoveFile;