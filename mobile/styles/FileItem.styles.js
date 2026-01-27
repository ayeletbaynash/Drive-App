import { StyleSheet } from 'react-native';

export const getFileItemStyles = (theme) => StyleSheet.create({ 
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: theme.background, 
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: theme.surface, 
    borderRadius: 8,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textMain,
  },
  dateText: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 2,
  },
  simpleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  menuButton: {
    padding: 8,
    marginLeft: 4,
  }
});

export const styles = getFileItemStyles;