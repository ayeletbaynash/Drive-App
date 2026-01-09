import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App';

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
        <div>
            <button onClick={(e) => handleClick(e)}>Edit Contenet</button>

            {isOpen && (
    <div onClick={(e) => e.stopPropagation()}>
        {isLoadingContent ? (
            <p>Loading content...</p>
        ) : (
            <>
                <strong>Edit Content:</strong>
                <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                />
                <div>
                    <button onClick={handleEditContent}>Save</button>
                    <button onClick={() => setIsOpen(false)}> Cancel</button>
                </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};



export default EditContent;

