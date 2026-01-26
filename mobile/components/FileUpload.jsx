import React, { forwardRef, useImperativeHandle } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import authorizedFetch from '../services/authorizedFetch';
import { API_URL } from '../config';

const FileUpload = forwardRef(({ folderId, onSuccess }, ref) => {

  useImperativeHandle(ref, () => ({
    handleUpload: () => {
      console.log("Starting safe upload process..."); 
      startPicker();
    }
  }));

  const startPicker = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      // Limit to specific file types if needed
      type: ['image/*', 'application/pdf', 'text/plain'],
      copyToCacheDirectory: true
    });

    if (result.canceled) return;
    const fileAsset = result.assets[0];

    const xhr = new XMLHttpRequest();
    xhr.open('GET', fileAsset.uri, true);
    xhr.responseType = 'blob';
    
    xhr.onload = () => {
      const blob = xhr.response;
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const resultString = reader.result;
        
        // check the result validity
        if (!resultString || typeof resultString !== 'string') {
          Alert.alert('Error', 'Failed to read file content');
          return;
        }

        // preparing data for server upload
        const bodyData = {
          name: fileAsset.name,
          type: 'file',
          parent_id: folderId || null,
          content: resultString
        };

        const response = await authorizedFetch(`${API_URL}/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        });

        if (response?.ok) {
          Alert.alert('Success', 'File uploaded!');
          DeviceEventEmitter.emit('somethingChange');
          if (onSuccess) onSuccess();
        } else {
          Alert.alert('Error', 'Server rejected the file');
        }
      };

      reader.onerror = (e) => {
        console.error("FileReader Error:", e);
        Alert.alert('Error', 'File reader failed');
      };

      reader.readAsDataURL(blob);
    };
    
    xhr.onerror = (e) => {
      console.error("XHR Error:", e);
      Alert.alert('Error', 'Failed to fetch file from device');
    };
    
    xhr.send();

  } catch (error) {
    console.error("Picker Error:", error);
    Alert.alert('Error', 'An unexpected error occurred');
  }
};

  return null;
});

export default FileUpload;