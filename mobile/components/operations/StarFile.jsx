import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useFileActions } from '../../context/FileContext';
import { getFileItemStyles } from '../../styles/FileItem.styles';
import { FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';

const StarFile = ({ file, onComplete }) => {
  const { toggleStarFile, starredFiles } = useFileActions();
  const { theme } = useAppTheme();
  const styles = getFileItemStyles(theme);

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
          <FontAwesome name="star" size={18} color={theme.starIcon} style={{ marginRight: 10 }} />
          <Text style={{ color: theme.textMain, fontSize: 16 }}>Remove Star</Text>
        </>
      ) : (
        <>
          <FontAwesome name="star-o" size={18} color={theme.textMuted} style={{ marginRight: 10 }} />
          <Text style={{ color: theme.textMain, fontSize: 16 }}>Add to Starred</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default StarFile;