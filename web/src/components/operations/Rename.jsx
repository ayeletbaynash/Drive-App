import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext'

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
        <div>
            <button onClick={(e) => handleClick(e)}>Rename</button>

            {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <strong>Rename:</strong>
                    <input type="text" value={nameWithoutExt} onChange={(e) => setNameWithoutExt(e.target.value)} autoFocus />
                    <span>{extension}</span>
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

