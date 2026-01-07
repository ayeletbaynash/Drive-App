import React, { useState } from 'react';

const CreateFolder = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    
    const pathArray = window.location.pathname.split('/');
    const lastPart = pathArray[pathArray.length - 1];
    const folderId = Number(lastPart) || null;

    const handleCreate = async () => {
        const bodyData = {
            name: name,
            type: 'folder',
            parent_id: folderId
        };

        try {
            const response = await fetch('http://localhost:8080/api/files', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                setIsOpen(false);
                setName('');
                onSuccess();
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Error ${response.status}: ${errorData.message || 'Failed'}`);
            }
        } catch (error) {
            alert('Network error');
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>New Folder</button>
            {isOpen && (
                <div>
                    <div>
                        Name: <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    </div>
                    <button onClick={handleCreate}>OK</button>
                    <button onClick={() => { setIsOpen(false); setName(''); }}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default CreateFolder;