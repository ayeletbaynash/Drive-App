import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App';

const Share = ({ file, onAction }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [permissions, setPermissions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [newUsername, setNewUsername] = useState("")
    const [newRole, setNewRole] = useState("read")

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}/permissions`);
            if (response.ok) {
                const data = await response.json();
                setPermissions(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchPermissions();
    }, [isOpen]);

    const handleAddPermission = async () => {
        if (!newUsername) return;

        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}/permissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername, permission: newRole })
            });

            if (response.ok) {
                setNewUsername("");
                fetchPermissions()
                window.dispatchEvent(new Event('somthingChange'))
            } else {
                const err = await response.json();
                alert(err.error || "Failed");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (pId) => {
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}/permissions/${pId}`, {
                method: 'DELETE'
            });
            if (response.ok){
                 fetchPermissions()
                 window.dispatchEvent(new Event('somthingChange'))
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateRole = async (pId, role) => {
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}/permissions/${pId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permission: role })
            });
            if (response.ok){ 
                fetchPermissions()
                window.dispatchEvent(new Event('somthingChange'))
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(true)}}>Share</button>

            {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <div>
                        <h2>Share: {file.name}</h2>

                        <div>
                            <h4>Current Access:</h4>
                            {isLoading ? <p>Loading...</p> : (
                                permissions.map(p => (
                                    <div key={p.pId}>
                                        <span>{p.username} ({p.permission})</span>
                                        <div>
                                            <select 
                                                value={p.permission} 
                                                onChange={(e) => handleUpdateRole(p.pId, e.target.value)}
                                            >
                                                <option value="read">Viewer</option>
                                                <option value="write">Editor</option>
                                                <option value="owner">Owner</option>
                                            </select>
                                            <button onClick={() => handleDelete(p.pId)}>Remove</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <hr />

                        <div>
                            <h4>Add New User:</h4>
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                <option value="read">Viewer</option>
                                <option value="write">Editor</option>
                                <option value="owner">Owner</option>
                            </select>
                            <button onClick={handleAddPermission}>Invite</button>
                        </div>

                        <button onClick={() => {setIsOpen(false); if (onAction) onAction()}}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Share;