import React, { createContext, useState, useContext, useEffect } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
    const getKeys = () => ({
        trash: `deletedFiles_${userId}`,
        starred: `starredFiles_${userId}`
    });

    const [deletedFiles, setDeletedFiles] = useState(() => {
        const { trash } = getKeys()
        const saved = localStorage.getItem(trash);
        return saved ? JSON.parse(saved) : [];
    });

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

    const restoreFromFileDeletionList = (fileId) => {
        setDeletedFiles((prev) => {
            const newState = prev.filter(f => f.id !== fileId);
            const { trash } = getKeys()
            localStorage.setItem(trash, JSON.stringify(newState));
            return newState;
        });
        window.dispatchEvent(new Event('somthingChange'));
    };

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

    return (
        <FileContext.Provider value={{ 
            deletedFiles, 
            addToFileDeletionList, 
            restoreFromFileDeletionList,
            starredFiles, 
            toggleStarFile 
        }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileActions = () => useContext(FileContext);