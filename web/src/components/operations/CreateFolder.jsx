import React, { useState } from 'react';
import { authorizedFetch } from '../../App';
import { useParams } from 'react-router-dom';
import '../../styles/operations.css';

const CreateFolder = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    
    const pathArray = window.location.pathname.split('/');
    const lastPart = pathArray[pathArray.length - 1];
    const folderId = (lastPart === "" || isNaN(lastPart)) ? null : Number(lastPart);

    const handleCreate = async () => {
        const bodyData = {
            name: name,
            type: 'folder',
            parent_id: folderId 
        };

        try {
            const response = await authorizedFetch('http://localhost:8080/api/files', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                setIsOpen(false)
                setName('')
                onSuccess()
                window.dispatchEvent(new Event('somthingChange'))

            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Error ${response.status}: ${errorData.message || 'Failed'}`);
            }
        } catch (error) {
            alert('Network error');
        }
    };

    return (
        <>
            {/* The button in the menu */}
            <button className="operation-button" onClick={() => setIsOpen(true)}>
                <i className="bi bi-folder-plus"></i>
                <span>New Folder</span>
            </button>

            {/* The designed model */}
            {isOpen && (
                <div className="modal-overlay" onClick={() => { setIsOpen(false); setName(''); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>New Folder</h3>
                        
                        <div className="input-group">
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Folder Name" 
                                autoFocus 
                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => { setIsOpen(false); setName(''); }}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleCreate}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateFolder;