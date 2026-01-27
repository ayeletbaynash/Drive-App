import { StyleSheet } from 'react-native';

export const createProfileStyles = (theme) => StyleSheet.create({
  // Profile Button (Top Bar)
  buttonContainer: {
    padding: 2,
    marginRight: 8, 
  },
  buttonImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },

  // Modal Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end', 
  },
  
  // The Sheet Itself 
  sheetContainer: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: theme.border,
    borderRadius: 3,
    marginBottom: 24,
  },

  // Header Content
  header: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: theme.primary,
  },
  avatarImageLarge: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: theme.white,
    fontSize: 36,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textMain,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: theme.textMuted, 
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: theme.border,
    marginBottom: 24,
  },

  // Action Buttons 
  actions: {
    width: '100%',
    gap: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30, 
    backgroundColor: theme.successIcon, 
  },
  logoutText: {
    color: theme.primary, 
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  doneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: theme.rowBackground, 
  },
  doneText: {
    color: theme.textMain,
    fontSize: 16,
    fontWeight: '600',
  }
});