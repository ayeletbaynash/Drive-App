import React, { createContext, useState, useContext, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authorizedFetch from '../services/authorizedFetch'; // ודאי שהנתיב תקין
import { API_URL } from '../config';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [deletedFiles, setDeletedFiles] = useState([]);
    const [starredFiles, setStarredFiles] = useState([]);

    // Helper to generate storage keys
    const getKeys = (id) => ({
        trash: `deletedFiles_${id}`,
        starred: `starredFiles_${id}`
    });

    // Load User and Files on mount
    useEffect(() => {
        const loadEverything = async () => {
            try {
                // Get the saved user from storage
                const savedUser = await AsyncStorage.getItem('user');
                if (savedUser) {
                    const user = JSON.parse(savedUser);
                    setUserId(user.id);
                    
                    //Get the specific keys for this user
                    const { trash, starred } = getKeys(user.id);
                    
                    //load trash and starred lists simultaneously
                    const [savedTrash, savedStarred] = await Promise.all([
                        AsyncStorage.getItem(trash),
                        AsyncStorage.getItem(starred)
                    ]);

                    if (savedTrash) setDeletedFiles(JSON.parse(savedTrash));
                    if (savedStarred) setStarredFiles(JSON.parse(savedStarred));
                }
            } catch (e) {
                console.error("Initialization error:", e);
            }
        };

        loadEverything();
    }, []);

    // Helper to save data and notify the app
    const saveData = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
            DeviceEventEmitter.emit('somethingChange');
        } catch (e) {
            console.error("Save error:", e);
        }
    };

    const refreshStarredFiles = async () => {
        if (!userId) return;
        try {
            const response = await authorizedFetch(`${API_URL}/files/starred`);
            if (response.ok) {
                const data = await response.json();
                setStarredFiles(data); 
                const { starred } = getKeys(userId);
                await saveData(starred, data); 
            }
        } catch (error) {
            console.error("Error refreshing starred files:", error);
        }
    };

    const addToFileDeletionList = async (file) => {
        if (userId === null) return;
        const isAlreadyDeleted = deletedFiles.some(f => f.id === file.id);
        if (isAlreadyDeleted) return;

        const newState = [...deletedFiles, file];
        setDeletedFiles(newState);
        const { trash } = getKeys(userId);
        await saveData(trash, newState);

        refreshStarredFiles();
    };

    const restoreFromFileDeletionList = async (fileId) => {
        if (userId === null) return;
        const newState = deletedFiles.filter(f => f.id !== fileId);
        setDeletedFiles(newState);
        const { trash } = getKeys(userId);
        await saveData(trash, newState);

        refreshStarredFiles();
    };

    const toggleStarFile = async (file) => {
        if (userId === null) return;
        let newState;
        const isStarred = starredFiles.some(f => f.id === file.id);

        if (isStarred) {
            newState = starredFiles.filter(f => f.id !== file.id);
        } else {
            newState = [...starredFiles, file];
        }
        
        setStarredFiles(newState);
        const { starred } = getKeys(userId);
        await saveData(starred, newState);

        try {
             const endpoint = `${API_URL}/files/${file.id}/star`;
             const method = isStarred ? 'DELETE' : 'POST';
             await authorizedFetch(endpoint, { method });
        } catch (e) { console.error(e); }
    };

    const updateFileInStarred = async (fileId, newData) => {
        if (userId === null) return;
        const isStarred = starredFiles.some(f => f.id === fileId);
        if (!isStarred) return;

        const newState = starredFiles.map(f => f.id === fileId ? { ...f, ...newData } : f);
        setStarredFiles(newState);
        const { starred } = getKeys(userId);
        await saveData(starred, newState);
    };

    return (
        <FileContext.Provider value={{ 
            userId,
            setUserId,
            deletedFiles, 
            addToFileDeletionList, 
            restoreFromFileDeletionList,
            starredFiles, 
            toggleStarFile,
            updateFileInStarred,
            refreshStarredFiles
        }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileActions = () => useContext(FileContext);