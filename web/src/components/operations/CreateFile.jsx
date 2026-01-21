import React, { useState } from 'react';
import { authorizedFetch } from '../../App';
import '../../styles/operations.css';

const CreateFile = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const handleCreate = async () => {
        const pathParts = window.location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];

        let parentId = null;
        if (lastPart && lastPart !== 'files' && lastPart !== 'home') {
            parentId = lastPart;
        }
        
        console.log("Creating file inside parent ID:", parentId);

        const bodyData = {
            name: `${name}.txt`,
            type: 'file',
            parent_id: parentId,
            content: content || "" 
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
                setContent('')
                onSuccess()
                window.dispatchEvent(new Event('somthingChange'))
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Error ${response.status}: ${errorData.message || 'Failed to create file'}`);
            }
        } catch (error) {
            console.error("The exact error is:", error);
            alert('Debug: Something went wrong in the code execution');
        }
    };

    const closeAndReset = () => {
        setIsOpen(false);
        setName('');
        setContent('');
    };

    return (
        <>
            {/* The button in the New menu */}
            <button className="operation-button" onClick={() => setIsOpen(true)}>
                <i className="bi bi-file-earmark-plus"></i>
                <span>New Text File</span>
            </button>

            {/* The designed model */}
            {isOpen && (
                <div className="modal-overlay" onClick={closeAndReset}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Create New File</h3>
                        
                        <div className="input-group">
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="File name" 
                                autoFocus 
                            />
                            <span style={{color: 'var(--text-muted)', fontWeight: 'bold'}}>.txt</span>
                        </div>

                        <textarea 
                            className="modal-textarea"
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="File content (optional)..."
                            rows="5"
                        />

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeAndReset}>Cancel</button>
                            <button className="btn-primary" onClick={handleCreate}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateFile;