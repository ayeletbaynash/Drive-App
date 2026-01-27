import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome6, AntDesign, FontAwesome } from '@expo/vector-icons';
import { styles } from '../styles/FileItem.styles';
import ActionSheet from './ActionSheet'
import React, { useState, useRef } from 'react' 
import RemoveFile from './operations/Remove'
import { useFileActions } from '../context/FileContext'
import StarFile from './operations/StarFile'
import Rename from './operations/Rename'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import EditContent from './operations/EditContent'
import Feather from '@expo/vector-icons/Feather'
import CopyFile from './operations/CopyFile'
import ChangeImage from './operations/ChangeImage'
import Share from './operations/Share';
import MoveFile from './operations/MoveFile'

import DownloadFile from './operations/DownloadFile';

const FileItem = ({ file, onOpen, isTrash, fetchFiles }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false)
 
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  
  // Ref for ChangeImage component
  const changeImageRef = useRef(null);

  const { starredFiles } = useFileActions();
  const isStarred = starredFiles.some(f => f.id === file.id)

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return <FontAwesome6 name="file-pdf" size={24} color="red" />
    if (fileName.endsWith('.txt')) return <AntDesign name="file-text" size={24} color="blue" />
    return <AntDesign name="file-image" size={24} color="green" />
  };

  return (
    <View style={styles.container}>
      {/* Click to Open */}
      <TouchableOpacity 
        style={styles.textContainer} 
        onPress={() => onOpen(file)}
        activeOpacity={0.6}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconContainer}>
            {getFileIcon(file.name)}
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              {isStarred && (
                <FontAwesome name="star" size={14} color="#ffc107" style={{ marginLeft: 6 }} />
              )}
            </View>
            <Text style={styles.dateText}>Modified: {new Date(file.updatedAt).toLocaleDateString('he-IL')} {new Date(file.updatedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Click for Menu */}
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => setIsMenuVisible(true)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>

      <ActionSheet 
        visible={isMenuVisible} 
        onClose={() => setIsMenuVisible(false)}
        fileName={file.name}
      >
        {isTrash === 'true' ? (
          <>
            <TouchableOpacity style={styles.simpleButton} onPress={() => alert('Restore')}>
              <Text style={{ color: 'green', fontSize: 16 }}>Restore</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.simpleButton} onPress={() => alert('Delete')}>
              <Text style={{ color: 'red', fontSize: 16 }}>Delete Forever</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <StarFile 
                file={file} 
                onComplete={() => setIsMenuVisible(false)} 
            />
            
            <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => {
                    setIsMenuVisible(false)
                    setIsRenameModalVisible(true)
                }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="drive-file-rename-outline" size={24} color="black" />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>Rename</Text>
              </View>
            </TouchableOpacity>

            <CopyFile 
              file={file} 
              onAction={() => setIsMenuVisible(false)} 
              onSuccess={fetchFiles} 
            />

            
            <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => {
                    setIsMenuVisible(false);
                    changeImageRef.current?.open(); 
                }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="image" size={22} color="black" />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>Replace Image</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => {
                    setIsMenuVisible(false);
                    setIsEditModalVisible(true);
                }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="edit" size={24} color="black" />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>Edit Content</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => {
                    setIsMenuVisible(false);
                    setIsShareModalVisible(true);
                }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="person-add-outline" size={24} color="black" />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>Share</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.simpleButton} 
                onPress={() => {
                    setIsMenuVisible(false);
                    setIsMoveModalVisible(true);
                }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="folder-open-outline" size={24} color="black" />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>Move to...</Text>
              </View>
            </TouchableOpacity>

            <DownloadFile 
              file={file} 
              onComplete={() => setIsMenuVisible(false)} 
            />
            
            
            <RemoveFile 
              file={file} 
              onComplete={() => setIsMenuVisible(false)}
            />
          </>
        )}
      </ActionSheet>

      {/*modals*/}
      <Rename 
          file={file} 
          visible={isRenameModalVisible} 
          onClose={() => setIsRenameModalVisible(false)} 
      />

      <ChangeImage 
          ref={changeImageRef} // חיבור ה-Ref
          file={file} 
          onAction={() => setIsMenuVisible(false)} 
      />

      <EditContent 
          file={file} 
          visible={isEditModalVisible} 
          onClose={() => setIsEditModalVisible(false)} 
      />
      <Share 
          file={file} 
          visible={isShareModalVisible} 
          onClose={() => setIsShareModalVisible(false)} 
      />
      <MoveFile 
          file={file} 
          visible={isMoveModalVisible} 
          onClose={() => setIsMoveModalVisible(false)} 
      />
     
    </View>
  );
};

export default FileItem;