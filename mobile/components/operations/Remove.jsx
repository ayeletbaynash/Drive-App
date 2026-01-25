import { TouchableOpacity, Text, Alert } from 'react-native';
import { useFileActions } from '../../context/FileContext'
import { styles } from '../../styles/FileItem.styles'
import { Feather } from '@expo/vector-icons'

const RemoveFile = ({ file, onComplete }) => {
  const { addToFileDeletionList } = useFileActions();

  const handleRemove = async () => {
    await addToFileDeletionList(file);
    if (onComplete) onComplete();
  };

  return (
    <TouchableOpacity style={styles.simpleButton} onPress={handleRemove}>
        <Feather name="trash-2" size={18} color="black" style={{ marginRight: 8 }} />
      <Text style={{ fontSize: 16 }}>Remove</Text>
    </TouchableOpacity>
  );
};

export default RemoveFile