import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../constants/theme'; // ודאי שיש לך גישה ל-theme

const { width } = Dimensions.get('window');

export const hardDeleteStyles = StyleSheet.create({
  // כפתור התפריט (בתוך ה-ActionSheet)
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  menuText: {
    fontSize: 16,
    color: '#dc3545', // אדום
    marginLeft: 10,
    fontWeight: '600',
  },

  // המודל עצמו
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
  // כותרת עם אייקון
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#dc3545', // אדום
    marginTop: 10,
  },
  
  // טקסטים
  bodyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
  },

  // כפתורים
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDelete: {
    flex: 1,
    backgroundColor: '#dc3545', // אדום
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnTextCancel: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  btnTextDelete: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});