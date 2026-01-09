import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App';

const Rename = ({ file, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(file.name);

    useEffect(() => {
        setName(file.name);
    }, [file.name]);
    
    const handleRename = async () => {
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name })
            });

            if (response.ok) {
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
     const handleClick= (e) => {
        e.stopPropagation()
        setIsOpen(true)
    }

    return (
        <div>
            <button onClick={(e) => handleClick(e)}>Rename</button>

            {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <strong>Rename:</strong>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                    <div>
                        <button onClick={handleRename}>Save</button>
                        <button onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Rename;

