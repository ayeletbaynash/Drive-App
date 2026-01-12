import { useState } from "react";
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext'

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
        <div>
            <button onClick={handleOpenModal}>Move To</button>

            {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <div>
                        <h3>Move "{file.name}"</h3>

                        {isLoading ? (
                            <p>Loading folders...</p>
                        ) : (
                            <>
                                <div>
                                    {allFolders.map((folder) => (
                                        <div key={folder.id}>
                                            <span>name: {folder.name}</span> 
                                            <span> ID: {folder.id}</span>
                                            <button onClick={() => setSelectedFolderId(folder.id)}>
                                                {selectedFolderId === folder.id ? "V" : "Select"}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <button onClick={handleConfirmClick}>
                                        Confirm Move
                                    </button>
                                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoveFile;