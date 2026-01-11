import React, { useState } from 'react';
import { authorizedFetch } from '../../App';
import { Spinner } from 'react-bootstrap';

const CopyFile = ({ file, onAction }) => {
    const [isCopying, setIsCopying] = useState(false);

    const handleCopy = async (e) => {
        e.stopPropagation(); // Preventing the file from opening
        setIsCopying(true);

        try {
            // Get the full contents of the file (because it is not usually in FileItem)
            const getRes = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`);
            const fullFileData = await getRes.json();
            
            if (!getRes.ok) throw new Error("Could not fetch original content");

            // Prepare the new name
            const nameParts = file.name.split('.');
            let newName;
            if (nameParts.length > 1) {
                const extension = nameParts.pop();
                newName = `${nameParts.join('.')}_copy.${extension}`;
            } else {
                newName = `${file.name}_copy`;
            }

            // Sending the POST with the content we received
            const bodyData = {
                name: newName,
                type: file.type || 'file',
                parent_id: file.parent_id,
                content: fullFileData.content 
            };

            const response = await authorizedFetch('http://localhost:8080/api/files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                alert('File copied successfully!');
                if (onAction) onAction(); // close menu
                //Refresh the list to see the new copy
                window.dispatchEvent(new Event('somthingChange'));
            } else {
                alert('Failed to copy file');
            }
        } catch (error) {
            console.error("Copy error:", error);
            alert('Error during copy process');
        }finally {
            setIsCopying(false);
        }
    };

    return (
        <button onClick={handleCopy} disabled={isCopying} className="menu-item-btn">
            {isCopying ? <Spinner animation="border" size="sm" /> : "Make a Copy"}
        </button>
    );
};

export default CopyFile;