import React, { useState } from 'react';

const CreateFile = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    
    const pathArray = window.location.pathname.split('/');
    const lastPart = pathArray[pathArray.length - 1];
    const folderId = Number(lastPart) || null;

    const handleCreate = async () => {
        const bodyData = {
            name: name,
            type: 'file',
            parent_id: folderId,
            content: content || "" 
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
                setIsOpen(false)
                setName('')
                setContent('')
                onSuccess()
                window.dispatchEvent(new Event('fileCreated'))
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Error ${response.status}: ${errorData.message || 'Failed to create file'}`);
            }
        } catch (error) {
            console.error("The exact error is:", error);
            alert('Debug: Something went wrong in the code execution');
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>New File</button>

            {isOpen && (
                <div>
                    <div>
                        Name: <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    </div>
                    <div>
                        Content: <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
                    </div>
                    <button onClick={handleCreate}>OK</button>
                    <button onClick={() => { setIsOpen(false); setName(''); setContent(''); }}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default CreateFile;