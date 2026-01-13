import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App';
import '../../styles/operations.css';

const EditContent = ({ file, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [isLoadingContent, setIsLoadingContent] = useState(false);

    const fetchFileContent = async () => {
        setIsLoadingContent(true);
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`, {
                method: 'GET'
            });
            const data = await response.json();
            setContent(data.content || ''); 
        } catch (error) {
            console.error(error);
            alert("Could not load file content");
        } finally {
            setIsLoadingContent(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchFileContent();
        }
    }, [isOpen]);

    const handleEditContent = async () => {
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content })
            });

            if (response.ok) {
                setIsOpen(false);
                if (onAction) onAction();
                window.dispatchEvent(new Event('somthingChange'));
            } else {
                alert("Failed to update content");
            }
        } catch (error) {
            console.error(error);
        }
    }
     const handleClick= (e) => {
        e.stopPropagation()
        setIsOpen(true)
    }

    return (
        <>
            <button className="operation-button" onClick={handleClick}>
                <i className="bi bi-pencil-square"></i>
                <span>Edit Content</span>
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content edit-content-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-confirm">
                            <h3>Edit "{file.name}"</h3>
                        </div>

                        {isLoadingContent ? (
                            <div className="loading-spinner">
                                <i className="bi bi-arrow-repeat spin-icon"></i>
                                <p>Loading content...</p>
                            </div>
                        ) : (
                            <>
                                <textarea 
                                    className="edit-textarea"
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                    placeholder="Type your content here..."
                                    autoFocus
                                />
                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={() => setIsOpen(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn-primary" onClick={handleEditContent}>
                                        Save Changes
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



export default EditContent;

