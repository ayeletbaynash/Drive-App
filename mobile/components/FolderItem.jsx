import React, { useState } from 'react';
import { TouchableOpacity, Text, View, DeviceEventEmitter } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/FolderItem.styles';
import ActionSheet from './ActionSheet';
import RemoveFile from './operations/Remove'; 
import HardDelete from './operations/HardDelete'; 
import Rename from './operations/Rename';
import { useFileActions } from '../context/FileContext';

const FolderItem = ({ folder, isTrash, onFolderPress }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false); // 👇 סטייט למודאל שינוי שם

  const { restoreFromFileDeletionList } = useFileActions();

  const handleRestore = async () => {
      const folderId = folder._id || folder.id;
      await restoreFromFileDeletionList(folderId);
      setIsMenuVisible(false);
      // עדכון המסך שהתיקייה שוחזרה
      DeviceEventEmitter.emit('somethingChange'); 
  };

  const menuButtonStyle = {
      flexDirection: 'row',   // זה מה ששם את האייקון והטקסט באותה שורה
      alignItems: 'center',   // מיישר אותם לגובה האמצע
      paddingVertical: 12,    // נותן קצת אוויר מלמעלה ולמטה
  };

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
          <Text style={styles.subText}>{'Folder'}</Text>
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
            <TouchableOpacity style={[styles.simpleButton, menuButtonStyle]} onPress={handleRestore}>
              <MaterialIcons name="restore" size={24} color="green" style={{ marginRight: 12 }} />
              <Text style={{ color: 'green', fontSize: 16 }}>Restore</Text>
            </TouchableOpacity>

            <HardDelete 
                file={folder} // שולחים את התיקייה כ-"file"
                onComplete={() => setIsMenuVisible(false)}
            />
          </>
        ) : (
          // regular
          <>
            <TouchableOpacity 
                style={[styles.simpleButton, menuButtonStyle]} 
                onPress={() => {
                    setIsMenuVisible(false); // סוגר את התפריט
                    setIsRenameModalVisible(true); // פותח את המודאל
                }}
            >
              <MaterialIcons name="drive-file-rename-outline" size={24} color="black" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16 }}>Rename</Text>
            </TouchableOpacity>

            <RemoveFile 
                file={folder} 
                onComplete={() => setIsMenuVisible(false)}
            />
          </>
        )}
      </ActionSheet>

      <Rename 
          file={folder} 
          visible={isRenameModalVisible} 
          onClose={() => setIsRenameModalVisible(false)} 
      />

    </View>
  );
};

export default FolderItem;