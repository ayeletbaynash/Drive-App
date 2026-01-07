import React, { useState, useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';

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
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            // Sending a GET request to the server based on the file ID
            const response = await fetch(`http://localhost:8080/api/files/${file.id}`, {
                headers: {
                    'user-id': userId,
                    'Authorization': `Bearer ${token}`
                }
            });

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

  if (!file) return null;  // if no file chosen dont show anything

  return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{file.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
                {loading ? (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div className="p-3">
                        {content}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default FileViewer;