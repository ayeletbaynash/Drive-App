import React from 'react';
import { TouchableOpacity, Text, DeviceEventEmitter } from 'react-native';
import { useFileActions } from '../../context/FileContext'
import { getFileItemStyles } from '../../styles/FileItem.styles'
import { Feather } from '@expo/vector-icons'
import { useAppTheme } from '../../context/ThemeContext';

const RemoveFile = ({ file, onComplete }) => {
  const { addToFileDeletionList } = useFileActions();
  const { theme } = useAppTheme();
  const styles = getFileItemStyles(theme);

  const handleRemove = async () => {
    await addToFileDeletionList(file);
    DeviceEventEmitter.emit('somethingChange');

    if (onComplete) onComplete();
  };

  return (
    <TouchableOpacity style={styles.simpleButton} onPress={handleRemove}>
        <Feather name="trash-2" size={18} color={theme.error} style={{ marginRight: 8 }} />
      <Text style={{ color: theme.error, fontSize: 16 }}>Remove</Text>
    </TouchableOpacity>
  );
};

export default RemoveFile;