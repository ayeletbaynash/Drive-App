import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useFileActions } from '../../context/FileContext';
import { styles } from '../../styles/FileItem.styles';
import { FontAwesome } from '@expo/vector-icons';

const StarFile = ({ file, onComplete }) => {
  const { toggleStarFile, starredFiles } = useFileActions();

  //check if the file is starred
  const isStarred = starredFiles.some((f) => f.id === file.id);

  const handleToggle = async () => {
    await toggleStarFile(file)
    if (onComplete) onComplete()
  };

  return (
    <TouchableOpacity style={styles.simpleButton} onPress={handleToggle}>
      {isStarred ? (
        <>
          <FontAwesome name="star" size={18} color="#ffc107" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16 }}>Remove Star</Text>
        </>
      ) : (
        <>
          <FontAwesome name="star-o" size={18} color="black" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16 }}>Add to Starred</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default StarFile;