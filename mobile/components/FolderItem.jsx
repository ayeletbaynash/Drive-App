import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/FolderItem.styles';
import ActionSheet from './ActionSheet';

const FolderItem = ({ folder, isTrash, onFolderPress }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => onFolderPress(folder)}
        disabled={isTrash} 
        style={styles.container}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="folder" size={24} color="#FFCA28" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.folderName} numberOfLines={1}>
            {folder.name}
          </Text>
          <Text style={styles.subText}>{ 'Folder'}</Text>
        </View>

        {/* 3 points*/}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsMenuVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* 3 points menu options*/}
      <ActionSheet
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        fileName={folder.name}
      >
        {isTrash ? (
          // for trash
          <>
            <TouchableOpacity style={styles.simpleButton} onPress={() => alert('Restore')}>
              <Text style={{ color: 'green', fontSize: 16 }}>Restore</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.simpleButton} onPress={() => alert('Delete Forever')}>
              <Text style={{ color: 'red', fontSize: 16 }}>Delete Forever</Text>
            </TouchableOpacity>
          </>
        ) : (
          // regular
          <>
            <TouchableOpacity style={styles.simpleButton} onPress={() => alert('Rename')}>
              <Text style={{ fontSize: 16 }}>Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.simpleButton} onPress={() => alert('Move to Trash')}>
              <Text style={{ color: 'red', fontSize: 16 }}>Move to Trash</Text>
            </TouchableOpacity>
          </>
        )}
      </ActionSheet>
    </View>
  );
};

export default FolderItem;