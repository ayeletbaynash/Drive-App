import React from 'react';
import { authorizedFetch } from '../../App';
import '../../styles/operations.css';

const DownloadFile = ({ file, onAction }) => {

    const handleDownload = async (e) => {
        e.stopPropagation(); // Prevents the double-clicking
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`);
            const data = await response.json();

            if (response.ok && data.content) {
                let downloadUrl;
                // is it uploaded
                if (data.content.startsWith('data:')){
                    downloadUrl = data.content;
                } else { // or created in drive
                    const blob = new Blob([data.content], { type: 'text/plain' }); // We create a Blob (file object) from the text
                    downloadUrl = window.URL.createObjectURL(blob); // Turn the blob into a temporary address that the browser can download
                }

                // create the downkoad element (for everything else)
                const link = document.createElement('a');
                link.href = downloadUrl;
                // adding txt ending for localy created files
                const fileName = data.content.startsWith('data:') ? file.name : `${file.name}.txt`;
                link.download = file.name; 
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // after creating a temporary address (URL.createObjectURL), we clear it from memory
                if (!data.content.startsWith('data:')) {
                    window.URL.revokeObjectURL(downloadUrl);
                }

                // close the menu after download
                if (onAction) onAction();
            } else {
                alert("Failed to download file");
            }
        } catch (error) {
            console.error("Error downloading:", error);
            alert("Error connecting to server");
        }
    };

    return (
        <button className="operation-button" onClick={handleDownload}>
            <i className="bi bi-download"></i>
            <span>Download</span>
        </button>
    );
};

export default DownloadFile;