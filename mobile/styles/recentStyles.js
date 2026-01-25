import { StyleSheet } from 'react-native';

export const createRecentStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    gap: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
  },
  backBtn: {
    padding: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: theme.textMuted,
    marginTop: 10,
    fontSize: 16,
  },
  loadingText: {
    color: theme.textMuted,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});