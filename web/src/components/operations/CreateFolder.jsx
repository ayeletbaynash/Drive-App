import React, { useState } from 'react';
import { authorizedFetch } from '../../App';
import { useParams } from 'react-router-dom';

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