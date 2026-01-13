import React, { useRef, useState } from 'react';
import { authorizedFetch } from '../../App';
import '../../styles/operations.css';

const EditImage = ({ file, onAction }) => {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target.result;

            try {
                const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: base64String })
                });

                if (response.ok) {
                    if (onAction) onAction(); // close the menu
                    window.dispatchEvent(new Event('somthingChange'));
                } else {
                    alert("Failed to update image");
                }
            } catch (error) {
                console.error(error);
            }
        };
        reader.readAsDataURL(selectedFile);
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png, .gif, .webp" 
            />
            
            <button 
                className="operation-button" 
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
            >
                {isUploading ? (
                    <>
                        <i className="bi bi-arrow-repeat spin-icon"></i>
                        <span>Uploading...</span>
                    </>
                ) : (
                    <>
                        <i className="bi bi-image"></i>
                        <span>Replace Image</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default EditImage;