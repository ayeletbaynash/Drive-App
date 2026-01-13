import React, { useState, useEffect } from 'react';
import { authorizedFetch } from '../../App';
import '../../styles/operations.css';

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
        <>
            <button className="operation-button" onClick={(e) => { e.stopPropagation(); setIsOpen(true)}}>
                <i className="bi bi-person-plus"></i>
                <span>Share</span>
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-confirm">
                            <h3>Share "{file.name}"</h3>
                        </div>

                        {/* Adding a new user */}
                        <div className="share-section">
                            <p className="section-title">Add people</p>
                            <div className="share-input-group">
                                <input 
                                    type="text" 
                                    placeholder="Enter username" 
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                                <select className="role-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                    <option value="read">Viewer</option>
                                    <option value="write">Editor</option>
                                    <option value="owner">Owner</option>
                                </select>
                                <button className="btn-primary-sm" onClick={handleAddPermission}>Invite</button>
                            </div>
                        </div>

                        {/* Managing existing permissions */}
                        <div className="share-section">
                            <p className="section-title">People with access</p>
                            <div className="permissions-list">
                                {isLoading ? <p>Loading...</p> : permissions.map(p => (
                                    <div key={p.pId} className="permission-item">
                                        <div className="user-info">
                                            <div className="user-avatar">{p.username.charAt(0).toUpperCase()}</div>
                                            <span>{p.username}</span>
                                        </div>
                                        <div className="user-actions">
                                            <select 
                                                className="role-select-inline"
                                                value={p.permission} 
                                                onChange={(e) => handleUpdateRole(p.pId, e.target.value)}
                                            >
                                                <option value="read">Viewer</option>
                                                <option value="write">Editor</option>
                                                <option value="owner">Owner</option>
                                            </select>
                                            <button className="remove-user-btn" onClick={() => handleDelete(p.pId)}>
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => {setIsOpen(false); if (onAction) onAction()}}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Share;