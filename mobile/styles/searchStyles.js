import { StyleSheet, Platform, StatusBar } from 'react-native';

export const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, 
    paddingBottom: 12,    
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 60,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30, 
    paddingHorizontal: 15,
    height: 46,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    height: '100%',
  },
  listContent: {
    paddingTop: 10,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  }
});