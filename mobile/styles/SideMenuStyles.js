import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const createSideMenuStyles = (theme) => StyleSheet.create({
  // המסך השקוף הכהה מאחור
  // מיכל כללי למודל
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  
  // הרקע השחור השקוף (מופרד כדי שנוכל לעשות לו Fade)
  backdrop: {
    ...StyleSheet.absoluteFillObject, // ממלא את כל המסך
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  
  // הקופסה של התפריט עצמו
  menuContainer: {
    width: width * 0.75, // 75% מרוחב המסך
    height: '100%',
    backgroundColor: theme.surface, // צבע רקע (לבן/כהה)
    zIndex: 2,
    paddingTop: 0, // כדי שהלוגו יהיה למעלה
    
    // הצללה לתפריט (Shadow)
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },

  // אזור הלוגו למעלה
  logoContainer: {
    height: 150, // גובה האזור של הלוגו
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.background, // צבע טיפה שונה להפרדה
    marginBottom: 20,
  },

  // רשימת הכפתורים
  navItems: {
    paddingHorizontal: 20,
    gap: 15,
  },

  // כפתור בודד
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    // רווח בין האייקון לטקסט
    gap: 15, 
  },

  // טקסט הכפתור
  navText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.primary, // ירוק מותג
  },

  // טקסט מיוחד כשנמצאים בעמוד פעיל (ירוק)
  activeNavText: {
    color: theme.primary,
    fontWeight: 'bold',
  },
  
  // אזור תחתון (אופציונלי, שמתי שם קרדיט או גרסה)
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