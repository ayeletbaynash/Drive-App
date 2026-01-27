import React, { useState } from 'react';
import { TouchableOpacity, Text, View, DeviceEventEmitter } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/FolderItem.styles';
import ActionSheet from './ActionSheet';
import RemoveFile from './operations/Remove'; 
import HardDelete from './operations/HardDelete'; 
import Rename from './operations/Rename';
import FileDetailsModal from './FileDetailsModal'; 
import { useFileActions } from '../context/FileContext';
import DownloadFolder from './operations/DownloadFolder';
import Share from './operations/Share';
import MoveFile from './operations/MoveFile';
import StarFile from './operations/StarFile';

const FolderItem = ({ folder, isTrash, onFolderPress }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false); 
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);

  const { restoreFromFileDeletionList, starredFiles } = useFileActions();
  const isStarred = starredFiles ? starredFiles.some(f => f.id === folder.id) : false;

  const userPermission = folder.permission || 'read'; 
  const isOwner = userPermission === 'owner';
  const canWrite = isOwner || userPermission === 'write';

  const handleRestore = async () => {
      const folderId = folder._id || folder.id;
      await restoreFromFileDeletionList(folderId);
      setIsMenuVisible(false);
      DeviceEventEmitter.emit('somethingChange'); 
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isStarred && (
                <Ionicons name="star" size={12} color="#FFC107" style={{ marginRight: 4 }} />
            )}
          <Text style={styles.subText}>Folder</Text>
        </View>
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
          {/* TRASH MODE (Owner Only) */}
            {isOwner && (
            <TouchableOpacity style={styles.simpleButton} onPress={handleRestore}>
              <MaterialIcons name="restore" size={24} color="green" />
              <Text style={{ color: 'green', fontSize: 16, fontWeight: '600' }}>Restore</Text>
            </TouchableOpacity>
            )}

            {isOwner && (
            <HardDelete 
                file={folder} 
                onComplete={() => setIsMenuVisible(false)}
            />
            )}
          </>
        ) : (
          // regular
          <>
          {/* NORMAL MODE */}
            
            {/* 1. Universal Actions */}
            <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => {
                    setIsMenuVisible(false); 
                    setTimeout(() => setIsDetailsVisible(true), 100);
                }}
            >
              <Ionicons name="information-circle-outline" size={24} color="black" />
              <Text style={{ fontSize: 16 }}>Details</Text>
            </TouchableOpacity>

            <StarFile 
                file={folder} 
                onComplete={() => setIsMenuVisible(false)} 
            />

            <DownloadFolder 
              folder={folder} 
              onSuccess={() => setIsMenuVisible(false)} 
            /> 

            <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => {
                    setIsMenuVisible(false);
                    setIsMoveModalVisible(true);
                }}
            >
              <Ionicons name="folder-open-outline" size={24} color="black" />
              <Text style={{ fontSize: 16 }}>Move to...</Text>
            </TouchableOpacity>
            
            {/* 2. Owner Only Actions */}
            {isOwner && (
            <RemoveFile 
                file={folder} 
                onComplete={() => setIsMenuVisible(false)}
            />
            )}

            {isOwner && (
            <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => {
                    setIsMenuVisible(false);
                    setIsRenameModalVisible(true);
                }}
            >
              <MaterialIcons name="drive-file-rename-outline" size={24} color="black" />
                 <Text style={{ fontSize: 16 }}>Rename</Text>
            </TouchableOpacity>
            )}

            {/* 3. Write/Editor Actions */}
            {canWrite && (
                <TouchableOpacity 
                    style={styles.simpleButton} 
                    onPress={() => {
                        setIsMenuVisible(false);
                        setIsShareModalVisible(true);
                    }}
                >
                  <Ionicons name="person-add-outline" size={24} color="black" />
                  <Text style={{ fontSize: 16 }}>Share</Text>
                </TouchableOpacity>
            )}
          </>
        )}
      </ActionSheet>

      {/* MODALS */}
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

      <Share 
          file={folder} 
          visible={isShareModalVisible} 
          onClose={() => setIsShareModalVisible(false)} 
      />
      
      <MoveFile 
          file={folder} 
          visible={isMoveModalVisible} 
          onClose={() => setIsMoveModalVisible(false)} 
      />
      
    </View>
  );
};

export default FolderItem;