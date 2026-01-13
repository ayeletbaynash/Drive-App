import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext'
import '../../styles/operations.css';

const HardDelete = ({ file, onAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { restoreFromFileDeletionList} = useFileActions()

    const handleDeleteForever = async (e) => {
        e.stopPropagation()
        
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                restoreFromFileDeletionList(file.id)
                if (onAction) onAction();
                window.dispatchEvent(new Event('somthingChange'));
            } else {
                alert("Failed to delete file");
            }
        } catch (error) {
            console.error(error);
        }

    }

    const openModal = (e) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    return (
        <>
            <button className="operation-button delete-danger" onClick={openModal}>
                <i className="bi bi-trash3-fill"></i>
                <span>Delete forever</span>
            </button>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content danger-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-confirm">
                            <h3><i className="bi bi-exclamation-triangle-fill" style={{ color: '#dc3545' }}></i>
                              Delete Forever?</h3>
                        </div>
                        
                        <div className="modal-body-text">
                            <p>Are you sure you want to permanently delete <strong>"{file.name}"</strong>?</p>
                            <p className="danger-subtext">This action cannot be undone.</p>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="btn-danger" onClick={handleDeleteForever}>
                                Permanently Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}



export default HardDelete;

