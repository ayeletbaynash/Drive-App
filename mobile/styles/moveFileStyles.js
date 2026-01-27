import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const createMoveFileStyles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    width: '100%',
    maxHeight: height * 0.7,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textMain,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: theme.textMuted,
    fontSize: 14,
  },
  folderList: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  selectedFolderItem: {
    backgroundColor: theme.rowBackground, 
  },
  folderIcon: {
    marginRight: 12,
  },
  folderName: {
    flex: 1,
    fontSize: 16,
    color: theme.textMain,
  },
  selectedFolderName: {
    color: theme.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.rowHover,
  },
  cancelButtonText: {
    color: theme.textMain,
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: theme.primary,
  },
  confirmButtonText: {
    color: theme.white,
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: theme.border,
  }
});