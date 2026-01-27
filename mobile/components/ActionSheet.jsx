import { View, Text, Modal, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { createActionSheetStyles } from '../styles/ActionSheet.styles';
import { useAppTheme } from '../context/ThemeContext';


export default function ActionSheet({ visible, onClose, fileName, children }) {
  const { theme } = useAppTheme();
  const styles = createActionSheetStyles(theme);
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Semi-transparent background that closes the menu when tapped */}
      <Pressable style={styles.overlay} onPress={onClose}>
        
        <View style={styles.sheetContainer}>
          {/* Visual handle at the top */}
          <View style={styles.handle} />
          
          <Text style={styles.title} numberOfLines={1}>{fileName}</Text>
          
          {/* Scrollable area for the menu options */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

      </Pressable>
    </Modal>
  );
}
