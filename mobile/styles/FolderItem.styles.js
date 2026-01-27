import { StyleSheet } from 'react-native';

export const createFolderItemStyles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12, 
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
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
    color: theme.textMain,
  },
  subText: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
  },
  chevronIcon: {
    opacity: 0.3,
    marginLeft: 8,
  }
});

export const styles = createFolderItemStyles;