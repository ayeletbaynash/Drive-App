import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome6, AntDesign } from '@expo/vector-icons';
import { styles } from '../styles/FileItem.styles';
import  ActionSheet from './ActionSheet'
import React, { useState } from 'react'
import RemoveFile from './operations/Remove'

const FileItem = ({ file, onOpen, isTrash }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);


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
        onPress={() =>onOpen(file)}
        activeOpacity={0.6}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconContainer}>
            {getFileIcon(file.name)}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
            <Text style={styles.dateText}>Modified: {file.lastModified}</Text>
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
      <TouchableOpacity style={styles.simpleButton} onPress={() => alert('Rename')}>
        <Text style={{ fontSize: 16 }}>Rename</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.simpleButton} onPress={() => alert('Share')}>
        <Text style={{ fontSize: 16 }}>Share</Text>
      </TouchableOpacity>
      
      <RemoveFile 
              file={file} 
              onComplete={() => setIsMenuVisible(false)}
      />
    </>
  )}
</ActionSheet>
    </View>
  );
};

export default FileItem;