import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext'
import '../../styles/operations.css';

const Rename = ({ file, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [nameWithoutExt, setNameWithoutExt] = useState("");
    const [extension, setExtension] = useState("");
    const { updateFileInStarred } = useFileActions();

    useEffect(() => {
        const lastDotIndex = file.name.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            setNameWithoutExt(file.name.substring(0, lastDotIndex));
            setExtension(file.name.substring(lastDotIndex));
        } else {
            setNameWithoutExt(file.name);
            setExtension("");
        }
    }, [file.name]);
    
    const handleRename = async () => {
        const finalName = `${nameWithoutExt}${extension}`;

        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: finalName })
            });

            if (response.ok) {
                updateFileInStarred(file.id, { name: finalName });
                setIsOpen(false);
                if (onAction) onAction();
                window.dispatchEvent(new Event('somthingChange'));
            } else {
                alert("Failed to update name");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleClick = (e) => {
        e.stopPropagation();
        setIsOpen(true);
    }

    return (
        <>
            <button className="operation-button" onClick={handleClick}>
                <i className="bi bi-pencil"></i>
                <span>Rename</span>
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Rename</h3>
                        
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={nameWithoutExt} 
                                onChange={(e) => setNameWithoutExt(e.target.value)} 
                                autoFocus 
                            />
                            <span style={{color: 'var(--text-muted)', fontWeight: 'bold'}}>{extension}</span>                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleRename}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Rename;

