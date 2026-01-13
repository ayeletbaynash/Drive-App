import { useEffect, useState } from 'react';
import { authorizedFetch } from '../../App'
import '../../styles/detailsPanel.css'; 

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
            <header className="panel-header">
                <div className="header-title">
                    <i className={`bi ${file.type === 'folder' ? 'bi-folder2' : 'bi-file-earmark-text'}`}></i>
                    <h2>Details</h2>
                </div>
                <button className="close-panel-btn" onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </header>

            <div className="panel-content">
                <section className="file-preview-section">
                    <div className="file-icon-large">
                         <i className={`bi ${file.type === 'folder' ? 'bi-folder-fill' : 'bi-file-earmark-fill'}`}></i>
                    </div>
                    <h3 className="file-name-display">{file.name}</h3>
                </section>

                <section className="info-group">
                    <h4>System Properties</h4>
                    <div className="info-row">
                        <span className="info-label">Type</span>
                        <span className="info-value">{file.type}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Created</span>
                        <span className="info-value">{new Date(file.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Last Modified</span>
                        <span className="info-value">{new Date(file.updated_at).toLocaleDateString()}</span>
                    </div>
                </section>

                <hr className="panel-divider" />

                <section className="info-group">
                    <h4>Who has access</h4>
                    <div className="access-item owner">
                        <div className="user-avatar-sm">
                            {owner ? owner.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{owner ? owner.username : 'Unknown'}</span>
                            <span className="user-role">Owner</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="panel-loader">Loading access...</div>
                    ) : (
                        <div className="collaborators-list">
                            {collaborators.map((p, index) => (
                                <div key={index} className="access-item">
                                    <div className="user-avatar-sm secondary">
                                        {p.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-details">
                                        <span className="user-name">{p.username}</span>
                                        <span className="user-role">{p.permission}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </aside>
    );
}

export default FileDetailsPanel;