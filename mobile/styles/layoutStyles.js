import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    backgroundColor: Colors.light.primary,
  },
  topBar: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.light.primary,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  topBarText: {
    color: Colors.light.surface,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.sans,
  },
  tabBarCustom: {
    height: 85,
    paddingBottom: 25,
    paddingTop: 10,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  activeColor: Colors.light.tabActive,
  inactiveColor: Colors.light.tabInactive,
});