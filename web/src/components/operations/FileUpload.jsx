import React, { useRef } from 'react';
import { authorizedFetch } from '../../App';

const FileUpload = ({ onSuccess }) => {
    const fileInputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        const isTextFile = file.name.endsWith('.txt')//check if the file is text
        // Runs when the browser finishes reading the file
        reader.onload = async (event) => {
            const fileContent = event.target.result; // the file as text

            // Extract the folderId from the URL (just like in CreateFile)
            const pathArray = window.location.pathname.split('/');
            const lastPart = pathArray[pathArray.length - 1];
            const folderId = (lastPart === "" || isNaN(lastPart)) ? null : Number(lastPart);
            
            // Preparing the data for sending
            const bodyData = {
            name: file.name,
            type: 'file',
            parent_id: folderId,
            content: fileContent // sending the image as text
        };

        try {
            // Note: In Upload we do not send Content-Type in Headers
            // The browser automatically adds it with the correct Boundary
            const response = await authorizedFetch('http://localhost:8080/api/files', {
                method: 'POST',
                headers: {  'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                alert('File uploaded successfully!');
                onSuccess(); // Closes the floating menu
                window.dispatchEvent(new Event('somthingChange')); // Refreshes the list 
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert('Error during upload');
        }
    };
    if (isTextFile) {
        reader.readAsText(file)//if the file is text save the content normal
    } else {
        reader.readAsDataURL(file); // Reads the file and converts it to Base64 format
    }
};

    return (
        <>
            {/* The original input is completely hidden */}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleUpload} 
                accept=".jpg, .jpeg, .png, .txt, .pdf"
            />

            {/* The styled button that clicks the hidden input */}
            <button 
                className="operation-button" 
                onClick={() => fileInputRef.current.click()}
            >
                <i className="bi bi-cloud-arrow-up"></i>
                <span>Upload File</span>
            </button>
        </>
    );
};

export default FileUpload;