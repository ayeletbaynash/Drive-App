import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Button } from 'react-bootstrap';
import { authorizedFetch } from '../../App';

const FileViewer = ({ file, show, onHide }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only if the modal is open and we have a file (or ID)
        if (show && file) {
            fetchFileContent();
        }
    }, [show, file]); // will run every time we open a new file

    const fetchFileContent = async () => {
        setLoading(true);
        try {
            // Sending a GET request to the server based on the file ID
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`);
            if (!response) return;

            const data = await response.json();
            if (response.ok) {
                // server returns an object with a content field
                setContent(data.content || "File is empty");
            } else {
                setContent("Error: " + data.error);
            }
        } catch (error) {
            setContent("Could not connect to server");
        } finally {
            setLoading(false);
        }
    };

    // adderssing each file type separetly
    const renderContent = () => {
        if (!content) return null;

        // image
        if (typeof content === 'string' && content.startsWith('data:image')) {
            return (
                <img 
                    src={content} 
                    alt={file.name} 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} 
                />
            );
        }

        // PDF
        if (typeof content === 'string' && content.startsWith('data:application/pdf')) {
            return (
                <embed 
                    src={content} 
                    type="application/pdf" 
                    width="100%" 
                    height="500px" 
                    style={{ borderRadius: '8px' }}
                />
            );
        }

        // txt
        if (typeof content === 'string' && content.startsWith('data:text/plain')) {
            try {
                const base64Data = content.split(',')[1];
                const decodedText = decodeURIComponent(escape(window.atob(base64Data)));
                return <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{decodedText}</pre>;
            } catch (e) {
                return <pre>Error decoding text file content</pre>;
            }
        }

        // Word (DOCX)
        if (typeof content === 'string' && (content.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document') || content.startsWith('data:application/msword'))) {
            return (
                <div className="p-5 border rounded bg-light">
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📄</div>
                    <h5>{file.name}</h5>
                    <p>Preview is not available for Word files</p>
                </div>
            );
        }

        // Default: Display content as plain text (for manually created groups in the app))
        return (
            <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                {content}
            </pre>
        );
    };

  if (!file) return null;  // if no file chosen dont show anything

return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{file.name}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body style={{ minHeight: '200px', maxHeight: '70vh', overflowY: 'auto' }}>
                {loading ? (
                    /* show spinner while loading...*/
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading file content...</p>
                    </div>
                ) : (
                    renderContent()
                )}
            </Modal.Body>

            
        </Modal>
    );
};

export default FileViewer;