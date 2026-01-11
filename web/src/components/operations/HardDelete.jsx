import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App'
import { useFileActions } from '../FileContext'

const HardDelete = ({ file, onAction }) => {
    const { restoreFromFileDeletionList} = useFileActions()

    const handleClick= async (e) => {
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

    return(
      <div>
        <button onClick={handleClick}>Delete forever</button>
      </div>  
    )
}



export default HardDelete;

