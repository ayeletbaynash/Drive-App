import React from 'react';
import { useFileActions } from '../FileContext';
import '../../styles/operations.css';

const Restore = ({file, onAction}) =>{
    const { restoreFromFileDeletionList} = useFileActions()

    const handleClick= (e) => {
        e.stopPropagation()
        restoreFromFileDeletionList(file.id)
        if (onAction) {
            onAction();
        }
    }

    return (
        <button className="operation-button restore-success" onClick={handleClick}>
            <i className="bi bi-arrow-counterclockwise"></i>
            <span>Restore</span>
        </button>
    )
}
export default Restore