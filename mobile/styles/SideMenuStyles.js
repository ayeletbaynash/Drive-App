import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const createSideMenuStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  
  backdrop: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  
  menuContainer: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: theme.surface, 
    zIndex: 2,
    paddingTop: 0, 
    
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },

  logoContainer: {
    height: 150, 
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.background, 
    marginBottom: 20,
  },

  navItems: {
    paddingHorizontal: 20,
    gap: 15,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 15, 
  },

  navText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.primary, 
  },

  activeNavText: {
    color: theme.primary,
    fontWeight: 'bold',
  },
  
  footer: {
    marginTop: 'auto',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    alignItems: 'center',
  },
  footerText: {
    color: theme.textMuted,
    fontSize: 12,
  }
});