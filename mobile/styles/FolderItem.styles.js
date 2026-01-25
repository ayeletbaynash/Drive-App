import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme'; 

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12, 
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.05)', 
    borderRadius: 8,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textMain,
  },
  subText: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  chevronIcon: {
    opacity: 0.3,
    marginLeft: 8,
  }
});