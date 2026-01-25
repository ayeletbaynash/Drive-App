import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FolderItem from './FolderItem';
import FileItem from './FileItem';

const FileViewList = ({ items, isTrash, onFolderPress }) => {
  const router = useRouter();
  
  // Separate folders and files
  const folders = items.filter(item => item.type === 'folder');
  const files = items.filter(item => item.type === 'file');

  // Navigate to the viewer screen when a file is opened
  const handleOpen = (file) => {
    router.push({
      pathname: '/file-viewer', 
      params: { file: file }
    });
  };

  return (
    <ScrollView>
      {/* Folders Section */}
      <View>
          {folders.map(f => (
            <FolderItem key={f.id} folder={f} isTrash={isTrash} onFolderPress={onFolderPress}  />
          ))}
      </View>

      {/* Files Section */}
      <View >
        <View>
          {files.map(f => (
            <FileItem 
              key={f.id} 
              file={f} 
              onOpen={handleOpen} 
              isTrash={isTrash} 
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default FileViewList;