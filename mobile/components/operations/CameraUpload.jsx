import React, { forwardRef, useImperativeHandle } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, DeviceEventEmitter } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CameraUpload = forwardRef(({ folderId, onSuccess }, ref) => {

  const takePhoto = async () => {
    // prompting for camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('access denied', 'We need camera permissions to take photos!');
      return;
    }

    // opening the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      handleUpload(result.assets[0]);
    }
  };

  const handleUpload = async (photo) => {
    try {
      // getting the auth token
      const token = await AsyncStorage.getItem('token');

      // creating a unique file name
      const timestamp = new Date().getTime();
      const fileName = `camera_photo_${timestamp}.jpg`;

      // converting the photo to base64
      const base64Content = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: 'base64',
      });

      const fullBase64 = `data:image/jpeg;base64,${base64Content}`;

      // sending to the server with auth token
      const response = await fetch(`${API_URL}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fileName,
          content: fullBase64,
          parent_id: folderId || null,
          type: 'file'
        }),
      });

      const responseText = await response.text();
      console.log("UPLOAD SERVER RESPONSE:", responseText);

      if (response.ok) {
        Alert.alert("Success", "Photo uploaded successfully!");
        DeviceEventEmitter.emit('somethingChange');
        if (onSuccess) onSuccess();
      } else {
        console.error("Upload failed with status:", response.status);
        throw new Error(`Server error ${response.status}: ${responseText}`);
      }

    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "We couldn't upload the photo to the server.");
    }
  };

  // exposing the function outside via Ref
  useImperativeHandle(ref, () => ({
    handleCamera: takePhoto,
  }));

  return null; 
});

export default CameraUpload;