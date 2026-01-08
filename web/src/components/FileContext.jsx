import React, { createContext, useState, useContext, useEffect } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const userId = localStorage.getItem('userId');
    const trashKey = `deletedFiles_${userId}`;
    const starredKey = `starredFiles_${userId}`;

    const [deletedFiles, setDeletedFiles] = useState(() => {
        const saved = localStorage.getItem(trashKey);
        return saved ? JSON.parse(saved) : [];
    });

    const [starredFiles, setStarredFiles] = useState(() => {
        const saved = localStorage.getItem(starredKey);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const savedTrash = localStorage.getItem(trashKey);
        const savedStarred = localStorage.getItem(starredKey);
        setDeletedFiles(savedTrash ? JSON.parse(savedTrash) : []);
        setStarredFiles(savedStarred ? JSON.parse(savedStarred) : []);
    }, [userId]);

    const addToFileDeletionList = (file) => {
        setDeletedFiles((prev) => {
            const isAlreadyDeleted = prev.some(f => f.id === file.id);
            if (isAlreadyDeleted) return prev;

            const newState = [...prev, file];
            localStorage.setItem(trashKey, JSON.stringify(newState));
            return newState;
        });
        window.dispatchEvent(new Event('somthingChange'));
    };

    const restoreFromFileDeletionList = (fileId) => {
        setDeletedFiles((prev) => {
            const newState = prev.filter(f => f.id !== fileId);
            localStorage.setItem(trashKey, JSON.stringify(newState));
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

            localStorage.setItem(starredKey, JSON.stringify(newState));
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