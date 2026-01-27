import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome6, AntDesign, FontAwesome } from '@expo/vector-icons';
import ActionSheet from './ActionSheet';
import React, { useState, useRef, useMemo } from 'react';
import RemoveFile from './operations/Remove';
import { useFileActions } from '../context/FileContext';
import StarFile from './operations/StarFile';
import Rename from './operations/Rename';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EditContent from './operations/EditContent';
import HardDelete from './operations/HardDelete';
import FileDetailsModal from './FileDetailsModal';
import Feather from '@expo/vector-icons/Feather';
import CopyFile from './operations/CopyFile';
import ChangeImage from './operations/ChangeImage';
import Share from './operations/Share';
import MoveFile from './operations/MoveFile';
import DownloadFile from './operations/DownloadFile';
import { useAppTheme } from '../context/ThemeContext';
import { getFileItemStyles } from '../styles/FileItem.styles';

const FileItem = ({ file, onOpen, isTrash, fetchFiles, onRestore }) => {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getFileItemStyles(theme), [theme]);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);

  const changeImageRef = useRef(null);
  const { starredFiles } = useFileActions();

  if (!file) return null;

  const isStarred = starredFiles.some(f => f.id === file.id);
  const userPermission = file.permission || 'read';
  const isOwner = userPermission === 'owner';
  const canWrite = isOwner || userPermission === 'write';

  const fileName = file.name || "";
  const isTextFile = fileName.toLowerCase().endsWith('.txt');
  const isImageFile = /\.(jpg|jpeg|png)$/i.test(fileName);

  const getFileIcon = (item) => {
    const name = item.name || "";
    const isFolder = item.type === 'folder' || (name.length > 0 && !name.includes('.'));

    if (isFolder) return <Ionicons name="folder" size={28} color={theme.folderIcon} />;
    if (name.endsWith('.pdf')) return <FontAwesome6 name="file-pdf" size={24} color={theme.pdfIcon} />;
    if (name.endsWith('.txt')) return <AntDesign name="file-text" size={24} color={theme.txtIcon} />;
    if (/\.(jpg|jpeg|png)$/i.test(name)) return <Ionicons name="image" size={24} color={theme.imageIcon} />;
    return <AntDesign name="file" size={24} color={theme.fileIcon} />;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.textContainer} 
        onPress={() => onOpen(file)}
        activeOpacity={0.6}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconContainer}>{getFileIcon(file)}</View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              {isStarred && <FontAwesome name="star" size={14} color={theme.starIcon} style={{ marginLeft: 6 }} />}
            </View>
            <Text style={styles.dateText}>
              Modified: {new Date(file.updatedAt).toLocaleDateString('he-IL')} {new Date(file.updatedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => setIsMenuVisible(true)}>
        <Ionicons name="ellipsis-vertical" size={20} color={theme.menuIcon} />
      </TouchableOpacity>

      <ActionSheet visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} fileName={file.name}>
        {isTrash ? (
          <>
            {isOwner && (
              <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => { setIsMenuVisible(false); if (onRestore) onRestore(); }}
              >
                <MaterialIcons name="restore" size={24} color={theme.successIcon} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.successIcon, fontSize: 16 }}>Restore</Text>
              </TouchableOpacity>
            )}
            {isOwner && <HardDelete file={file} onComplete={() => setIsMenuVisible(false)} />}
          </>
        ) : (
          <>
            {/* 1. UNIVERSAL ACTIONS */}
            <TouchableOpacity 
              style={styles.simpleButton} 
              onPress={() => { setIsMenuVisible(false); setTimeout(() => setIsDetailsVisible(true), 100); }}
            >
              <Ionicons name="information-circle-outline" size={24} color={theme.textMain} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.textMain, fontSize: 16 }}>Details</Text>
            </TouchableOpacity>

            <StarFile file={file} onComplete={() => setIsMenuVisible(false)} />
            
            <CopyFile file={file} onAction={() => setIsMenuVisible(false)} onSuccess={fetchFiles} />

            <DownloadFile file={file} onComplete={() => setIsMenuVisible(false)} />

            {/* 2. WRITE PERMISSIONS */}
            {canWrite && (
              <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => { setIsMenuVisible(false); setIsRenameModalVisible(true); }}
              >
                <MaterialIcons name="drive-file-rename-outline" size={24} color={theme.textMain} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.textMain, fontSize: 16 }}>Rename</Text>
              </TouchableOpacity>
            )}

            {canWrite && isImageFile && (
              <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => { setIsMenuVisible(false); changeImageRef.current?.open(); }}
              >
                <FontAwesome name="image" size={22} color={theme.textMain} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.textMain, fontSize: 16 }}>Replace Image</Text>
              </TouchableOpacity>
            )}

            {canWrite && isTextFile && (
              <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => { setIsMenuVisible(false); setIsEditModalVisible(true); }}
              >
                <Feather name="edit" size={24} color={theme.textMain} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.textMain, fontSize: 16 }}>Edit Content</Text>
              </TouchableOpacity>
            )}

            {/* 3. OWNER PERMISSIONS */}
            {isOwner && (
              <>
                <TouchableOpacity 
                  style={styles.simpleButton} 
                  onPress={() => { setIsMenuVisible(false); setIsShareModalVisible(true); }}
                >
                  <Ionicons name="person-add-outline" size={24} color={theme.textMain} style={{ marginRight: 8 }} />
                  <Text style={{ color: theme.textMain, fontSize: 16 }}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.simpleButton} 
                  onPress={() => { setIsMenuVisible(false); setIsMoveModalVisible(true); }}
                >
                  <Ionicons name="folder-open-outline" size={24} color={theme.textMain} style={{ marginRight: 8 }} />
                  <Text style={{ color: theme.textMain, fontSize: 16 }}>Move to...</Text>
                </TouchableOpacity>

                <RemoveFile file={file} onComplete={() => setIsMenuVisible(false)} />
              </>
            )}
          </>
        )}
      </ActionSheet>

      {/* Modals */}
      <Rename file={file} visible={isRenameModalVisible} onClose={() => setIsRenameModalVisible(false)} />
      <ChangeImage ref={changeImageRef} file={file} onAction={() => setIsMenuVisible(false)} />
      <EditContent file={file} visible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} />
      <FileDetailsModal file={file} visible={isDetailsVisible} onClose={() => setIsDetailsVisible(false)} />
      <Share file={file} visible={isShareModalVisible} onClose={() => setIsShareModalVisible(false)} />
      <MoveFile file={file} visible={isMoveModalVisible} onClose={() => setIsMoveModalVisible(false)} />
    </View>
  );
};

export default FileItem;