import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authorizedFetch } from '../../App';
import { useFileActions } from '../FileContext';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import '../../styles/layout.css'; 

function SearchBar({ onSearch }) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { deletedFiles } = useFileActions();

  // Flag to prevent redundant search triggers when selecting a suggestion manually
  const isSelectingSuggestion = useRef(false);

  // Cache to store the 'deleted' status of parent folders to avoid repetitive API calls
  const parentStatusCache = useRef(new Map());

    // Helper: Recursively checks if a file is located inside a folder that is in the trash.
    const isUnderDeletedFolder = async (file) => {
    let parentId = file.parent_id;

    while (parentId !== null) {
      // Check cache first to speed up the process
      if (parentStatusCache.current.has(parentId)) {
        return parentStatusCache.current.get(parentId);
      }

      const url =
        parentId === null
          ? 'http://localhost:8080/api/files'
          : `http://localhost:8080/api/files/${parentId}`;

      try {
        const response = await authorizedFetch(url, { method: 'GET' });
        if (!response.ok) {
          parentStatusCache.current.set(parentId, false);
          return false;
        }

        const parent = await response.json();

        // If any ancestor folder is in the deletedFiles list, the file is considered deleted
        if (deletedFiles.some(df => df.id === parent.id)) {
          parentStatusCache.current.set(parentId, true);
          return true;
        }

        // Move up to the next parent level
        parentId = parent.parent_id;
      } catch (e) {
        parentStatusCache.current.set(parentId, false);
        return false;
      }
    }

    return false;
  };

  // Filters out deleted files and files within deleted folders.
  const fetchFromServer = async (query, signal) => {
    if (!query || !query.trim()) return [];

    setIsSearching(true);

    try {
      // Pass the AbortController signal to cancel old requests if the user keeps typing
      const response = await authorizedFetch(
        `http://localhost:8080/api/search/${encodeURIComponent(query)}`,
        { method: 'GET', signal }
      );

      if (!response.ok) return [];
      const data = await response.json();
      
      const filtered = [];
      const lowerQuery = query.toLowerCase();

      for (const file of data) {
        if (deletedFiles.some(df => df.id === file.id)) continue;
        
        if (file.parent_id && deletedFiles.some(df => df.id === file.parent_id.toString())) {
            continue;
        }

        // Specific filtering for images and PDFs
        const fileName = (file.name || "").toLowerCase();
            const isImageOrpdf = fileName.endsWith('.png') || 
                            fileName.endsWith('.jpg') || 
                            fileName.endsWith('.jpeg') ||
                            fileName.endsWith('.pdf');
        if (isImageOrpdf) {
                if (!fileName.includes(lowerQuery)) {
                    continue; 
                }
            }
             
        // Check recursive folder deletion status    
        const underDeleted = await isUnderDeletedFolder(file);
        if (!underDeleted) {
          filtered.push(file);
        }
      }

      return filtered;

    } catch (err) {
      if (err.name === 'AbortError') {
        return null; 
      }
      console.error('Search error:', err);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  // Provides real-time suggestions as the user types, with a 400ms delay.
  useEffect(() => {
    const controller = new AbortController();

    if (!text.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timeout = setTimeout(async () => {
      const results = await fetchFromServer(text, controller.signal);
      
      if (results !== null) {
        setSuggestions(results.slice(0, 5)); // Limit to top 5 suggestions
        setShowSuggestions(true);
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort(); 
    };
  }, [text, deletedFiles]);

  // Keeps the search bar text in sync with the 'q' parameter in the URL (for back/forward navigation).
  useEffect(() => {
    const performSearchFromUrl = () => {
    const q = searchParams.get('q');

    if (!q) {
        setText('');
        onSearch([]); 
        return;
    }

    if (isSelectingSuggestion.current) {
      setText(q);
      fetchFromServer(q).then(res => res && onSearch(res));
    }
    isSelectingSuggestion.current = false;
  };

  performSearchFromUrl();

  // Global Event Listener for refreshing
    const handleRefresh = () => {
      performSearchFromUrl();
    };
    window.addEventListener('somthingChange', handleRefresh);
    return () => window.removeEventListener('somthingChange', handleRefresh);
  }, [searchParams]);

  // Handle Enter key or search button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setShowSuggestions(false);
    
    const results = await fetchFromServer(text);
    if (results) onSearch(results);

    navigate(`/home/search?q=${encodeURIComponent(text)}`);
  };

  // * Handle selecting an item from the suggestion dropdown
  const handleSuggestionClick = (file) => {
    isSelectingSuggestion.current = true;
    
    setText(file.name);
    setShowSuggestions(false);

    onSearch([file]);

    navigate(`/home/search?q=${encodeURIComponent(file.name)}`);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit} className="search-container">
        <button className="search-icon-btn" type="submit" disabled={isSearching}>
            {isSearching ? (
                <div className="spinner-border spinner-border-sm text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <i className="bi bi-search"></i>
            )}
        </button>
        <input
          className="search-input"
          type="text"
          placeholder="Search in drive"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((file) => {
            let iconClass = 'bi-file-earmark-text';
            let iconColor = 'var(--text-muted)';

            if (file.type === 'folder') {
                iconClass = 'bi-folder-fill';
                iconColor = '#ffc107'; 
            } else if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
                iconClass = 'bi-image';
                iconColor = 'var(--primary)';
            } else if (file.name.endsWith('.pdf')) {
                iconClass = 'bi-file-earmark-pdf-fill';
                iconColor = '#dc3545'; 
            }
            return(
            <div
              key={file.id}
              onMouseDown={() => handleSuggestionClick(file)}
              className="suggestion-item"
            >
              <i className={`bi ${iconClass}`} style={{ color: iconColor, fontSize: '1.2rem' }}></i>
              <span>{file.name}</span>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;