import React, { useState } from 'react';
import { useFileActions } from '../FileContext';
import '../../styles/operations.css';

const SoftDelete = ({file, onAction}) =>{
    const [isOpen, setIsOpen] = useState(false);
    const { addToFileDeletionList} = useFileActions()

    const handleClick= (e) => {
        e.stopPropagation()
        addToFileDeletionList(file)
        if (onAction) {
            onAction();
        }
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        addToFileDeletionList(file);
        setIsOpen(false);
        if (onAction) {
            onAction();
        }
    };
    
    const openModal = (e) => {
        e.stopPropagation();
        setIsOpen(true);
    };

    const closeAndStop = (e) => {
        e.stopPropagation();
        setIsOpen(false);
    };

    return (
        <>
            <button className="operation-button" onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}>
                <i className="bi bi-trash"></i>
                <span>Remove</span>
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={closeAndStop}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-confirm">
                            <h3>Remove?</h3>
                        </div>
                        
                        <p style={{ color: 'var(--text-main)' }}>
                            Are you sure you want to move <strong>{file.name}</strong> to the trash?
                        </p>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeAndStop}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleDelete}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default SoftDelete;