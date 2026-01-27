import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const createHardDeleteStyles = (theme) => StyleSheet.create({
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  menuText: {
    fontSize: 16,
    color: theme.error, 
    marginLeft: 10,
    fontWeight: '600',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.error, 
    marginTop: 10,
  },
  
  bodyText: {
    fontSize: 16,
    color: theme.textMain,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  warningText: {
    fontSize: 14,
    color: theme.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: theme.rowHover,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDelete: {
    flex: 1,
    backgroundColor: theme.error, 
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnTextCancel: {
    color: theme.textMain,
    fontSize: 16,
    fontWeight: '600',
  },
  btnTextDelete: {
    color: theme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});