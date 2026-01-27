import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '../constants/theme'; 

export const createActionSheetStyles = (theme) => StyleSheet.create({
  // The dark, semi-transparent background behind the menu
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end', // Aligns the sheet to the bottom of the screen
  },

  // The main white container of the bottom sheet
  sheetContainer: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: BorderRadius.lg * 2, // Gives the rounded "sheet" look
    borderTopRightRadius: BorderRadius.lg * 2,
    padding: Spacing.lg,
    maxHeight: '70%', // Prevents the menu from covering more than 70% of the screen
    
    // Shadow properties for iOS and Android elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },

  // The small horizontal bar at the top of the sheet for visual guidance
  handle: {
    width: 40,
    height: 5,
    backgroundColor: theme.border,
    borderRadius: BorderRadius.round,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },

  // Style for the filename displayed at the top of the menu
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textMain,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },

  // Space at the bottom of the list to ensure the last item isn't cut off
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // The "Cancel" button styling
  closeButton: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: theme.background,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },

  closeButtonText: {
    color: theme.error, // Reddish color for destructive/cancel actions
    fontWeight: '600',
    fontSize: 16,
  },

  // Style for the simple text buttons you injected in FileItem
  // This handles the spacing and separators between options
  simpleButton: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export const styles = createActionSheetStyles;