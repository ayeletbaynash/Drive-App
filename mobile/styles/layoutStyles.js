import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Colors.light.background,
  },
  safeArea: {
    backgroundColor: Colors.light.background,
  },
  topBarContainer: {
    flexDirection: 'row',     // מסדר את ההמבורגר, החיפוש והפרופיל בשורה
    alignItems: 'center',     // ממקם אותם באמצע הגובה
    paddingHorizontal: 16,
    paddingVertical: 10,
    //backgroundColor: Colors.light.background,
    gap: 12,                  // רווח בין האלמנטים
    borderBottomWidth: 1,
    //borderBottomColor: '#f0f0f0', // קו הפרדה עדין מאוד
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    flex: 1,                  // לוקח את כל המקום הפנוי באמצע
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: '#f1f3f4', // אפור בהיר ספציפי של גוגל (אפשר להוסיף ל-theme בהמשך)
    paddingVertical: 10,      // קצת יותר גבוה
    paddingHorizontal: 16,
    borderRadius: 30,         // עיגול מלא בקצוות (Pill shape)
  },
  searchPlaceholder: {
    //color: '#5f6368',         // אפור טקסט של גוגל
    fontSize: 16,
    marginLeft: 8,
    fontFamily: Fonts.sans,   // שימוש בפונט שלך
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, 
  },
  profileButton: {
    padding: 2,
    // אם תרצי מסגרת לתמונה בעתיד, זה המקום
  },
  tabBarCustom: {
    height: 85,
    paddingBottom: 25,
    paddingTop: 10,
    //backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    //borderTopColor: Colors.light.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  //activeColor: Colors.light.tabActive,
  //inactiveColor: Colors.light.tabInactive,
});