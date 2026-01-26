import React, { forwardRef, useImperativeHandle } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

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
      quality: 0.8,
    });

    if (!result.canceled) {
      handleUpload(result.assets[0]);
    }
  };

  const handleUpload = async (photo) => {
    try {
      console.log("Uploading photo from camera...", photo.uri);
      

      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Error", "We couldn't upload the photo.");
    }
  };

  // exposing the function outside via Ref
  useImperativeHandle(ref, () => ({
    handleCamera: takePhoto,
  }));

  return null; 
});

export default CameraUpload;