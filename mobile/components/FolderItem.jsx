import React, { useState } from 'react';
import { TouchableOpacity, Text, View, DeviceEventEmitter } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createFolderItemStyles } from '../styles/FolderItem.styles';
import ActionSheet from './ActionSheet';
import RemoveFile from './operations/Remove'; 
import HardDelete from './operations/HardDelete'; 
import Rename from './operations/Rename';
import FileDetailsModal from './FileDetailsModal'; 
import { useFileActions } from '../context/FileContext';
import DownloadFolder from './operations/DownloadFolder';
import { useAppTheme } from '../context/ThemeContext';

const FolderItem = ({ folder, isTrash, onFolderPress }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false); 
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const { restoreFromFileDeletionList } = useFileActions();
  const { theme } = useAppTheme();
  const styles = createFolderItemStyles(theme);

  const handleRestore = async () => {
      const folderId = folder._id || folder.id;
      await restoreFromFileDeletionList(folderId);
      setIsMenuVisible(false);
      DeviceEventEmitter.emit('somethingChange'); 
  };

  const menuButtonStyle = {
      flexDirection: 'row',   
      alignItems: 'center',   
      paddingVertical: 12,   
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
          <Ionicons name="folder" size={24} color={theme.folderIcon} />
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
          <Ionicons name="ellipsis-vertical" size={20} color={theme.menuIcon} />
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
              <MaterialIcons name="restore" size={24} color={theme.successIcon} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.successIcon, fontSize: 16 }}>Restore</Text>
            </TouchableOpacity>

            <HardDelete 
                file={folder} 
                onComplete={() => setIsMenuVisible(false)}
            />
          </>
        ) : (
          // regular
          <>
            <TouchableOpacity 
                style={[styles.simpleButton, menuButtonStyle]} 
                onPress={() => {
                    setIsMenuVisible(false); 
                    setTimeout(() => setIsDetailsVisible(true), 100);
                }}
            >
              <Ionicons name="information-circle-outline" size={24} color={theme.textMain} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.textMain, fontSize: 16 }}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.simpleButton, menuButtonStyle]} 
                onPress={() => {
                    setIsMenuVisible(false);
                    setIsRenameModalVisible(true);
                }}
            >
              <MaterialIcons name="drive-file-rename-outline" size={24} color={theme.textMain} style={{ marginRight: 12 }} />
                 <Text style={{ color: theme.textMain, fontSize: 16 }}>Rename</Text>
            </TouchableOpacity>

            <DownloadFolder 
              folder={folder} 
              onSuccess={() => setIsMenuVisible(false)} 
            />             

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

      <FileDetailsModal 
        file={folder}
        visible={isDetailsVisible}
        onClose={() => setIsDetailsVisible(false)}
      />
      
    </View>
  );
};

export default FolderItem;