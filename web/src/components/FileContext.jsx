import React, { createContext, useState, useContext, useEffect } from 'react';

// Provides a global state for managing deleted (trash) and starred files.
const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
    const getKeys = () => ({
        trash: `deletedFiles_${userId}`,
        starred: `starredFiles_${userId}`
    });

    // Initialize deletedFiles state from localStorage or default to an empty array
    const [deletedFiles, setDeletedFiles] = useState(() => {
        const { trash } = getKeys()
        const saved = localStorage.getItem(trash);
        return saved ? JSON.parse(saved) : [];
    });

    // Initialize starredFiles state from localStorage or default to an empty array
    const [starredFiles, setStarredFiles] = useState(() => {
        const { starred } = getKeys();
        const saved = localStorage.getItem(starred);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const { trash, starred } = getKeys()
        const savedTrash = localStorage.getItem(trash);
        const savedStarred = localStorage.getItem(starred);
        setDeletedFiles(savedTrash ? JSON.parse(savedTrash) : []);
        setStarredFiles(savedStarred ? JSON.parse(savedStarred) : []);
    }, [userId]);

    // Adds a file to the virtual "Trash" and updates both the application state and the persistent localStorage.
    const addToFileDeletionList = (file) => {
        setDeletedFiles((prev) => {
            const isAlreadyDeleted = prev.some(f => f.id === file.id);
            if (isAlreadyDeleted) return prev;

            const newState = [...prev, file]
            const { trash } = getKeys()
            localStorage.setItem(trash, JSON.stringify(newState));
            return newState;
        });
        window.dispatchEvent(new Event('somthingChange'));
    };

    // Removes a file from the virtual "Trash" (Restores it).
    const restoreFromFileDeletionList = (fileId) => {
        setDeletedFiles((prev) => {
            const newState = prev.filter(f => f.id !== fileId);
            const { trash } = getKeys()
            localStorage.setItem(trash, JSON.stringify(newState));
            return newState;
        });
        window.dispatchEvent(new Event('somthingChange'));
    };

    // Toggles the "Starred" status of a file.
    const toggleStarFile = (file) => {
        setStarredFiles((prev) => {
            let newState;
            const isStarred = prev.some(f => f.id === file.id);

            if (isStarred) {
                newState = prev.filter(f => f.id !== file.id);
            } else {
                newState = [...prev, file];
            }
            const { starred } = getKeys()
            localStorage.setItem(starred, JSON.stringify(newState));
            return newState;
        });
        window.dispatchEvent(new Event('somthingChange'));
    };

    const updateFileInStarred = (fileId, newData) => {
    setStarredFiles((prev) => {
        const isStarred = prev.some(f => f.id === fileId);
        if (!isStarred) return prev;

        const newState = prev.map(f => f.id === fileId ? { ...f, ...newData } : f);
        
        const { starred } = getKeys();
        localStorage.setItem(starred, JSON.stringify(newState));
        
        return newState;
        });
    };

    return (
        <FileContext.Provider value={{ 
            deletedFiles, 
            addToFileDeletionList, 
            restoreFromFileDeletionList,
            starredFiles, 
            toggleStarFile,
            updateFileInStarred
        }}>
            {children}
        </FileContext.Provider>
    );
};

// Provides an easy way for components to access file states and actions.
export const useFileActions = () => useContext(FileContext);