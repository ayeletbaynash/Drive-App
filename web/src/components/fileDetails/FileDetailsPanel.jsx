import { useEffect, useState } from 'react';
import { authorizedFetch } from '../../App'

function FileDetailsPanel({ file, onClose }) {
    console.log("!!! Panel is Rendering with:", file)
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
       const handleRefreshEvent = () => {
            fetchPermissions();
        };

        window.addEventListener('somthingChange', handleRefreshEvent);

        if (file && (file.id !== undefined && file.id !== null)) {
            fetchPermissions();
        }

        return () => {
            window.removeEventListener('somthingChange', handleRefreshEvent);
        };
    }, [file])

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await authorizedFetch(`http://localhost:8080/api/files/${file.id}/permissions`);
            if (!response.ok) throw new Error('Failed to fetch!!!');
            const data = await response.json();
            setPermissions(data);
        } catch (error) {
            console.error("Error:", error);
            setPermissions([]);
        } finally {
            setLoading(false);
        }
    };

    const owner = permissions.find(p => p.permission == 'owner');
    const collaborators = permissions.filter(p => p.permission !== 'owner');

    return (
        <aside className="file-details-sidebar">
            <header>
                <h2>{file.name} Details</h2>
                <button onClick={onClose}>X</button>
            </header>

            <section className="basic-info">
                <p><strong>ID:</strong> {file.id}</p>
                <p><strong>Type:</strong> {file.type}</p>
                <p><strong>Parent ID:</strong> {file.parent_id ?? 'Root'}</p>
                <p><strong>Created:</strong> {file.created_at}</p>
                <p><strong>Updated:</strong> {file.updated_at}</p>
            </section>

            <hr />

            <section className="permissions-info">
                <h3>Access Management</h3>
                
                <div className="owner-section">
                    <p><strong>Owner:</strong></p>
                    <span>{owner ? owner.username : file.user_id}</span>
                </div>

                <div className="collaborators-section">
                    <p><strong>Other Collaborators:</strong></p>
                    {loading ? (
                        <p>Loading permissions...</p>
                    ) : collaborators.length > 0 ? (
                        <ul>
                            {collaborators.map((p, index) => (
                                <li key={index}>
                                    {p.username} ({p.permission})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No additional users with access</p>
                    )}
                </div>
            </section>
        </aside>
    );
}

export default FileDetailsPanel;