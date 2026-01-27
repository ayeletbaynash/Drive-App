import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/theme';

const { height } = Dimensions.get('window');

export const createFileDetailsModalStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: theme.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        maxHeight: height * 0.85, 
        paddingBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    handleWrapper: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: theme.border,
        borderRadius: 3,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 12,
        textAlign: 'center',
        color: theme.textMain,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.textMuted,
        marginBottom: 10,
        marginTop: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoBox: {
        backgroundColor: theme.rowBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        color: theme.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
    value: {
        color: theme.textMain,
        fontSize: 14,
        fontWeight: '600',
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarOwner: {
        backgroundColor: theme.successIcon,
    },
    avatarCollab: {
        backgroundColor: theme.textMuted, 
    },
    avatarText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: theme.white,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textMain,
    },
    role: {
        fontSize: 13,
        color: theme.textMuted,
    },
    emptyText: {
        color: theme.textMuted,
        fontStyle: 'italic',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 5,
    },
    scrollContent: {
        paddingBottom: 20
    }
});

export const styles = createFileDetailsModalStyles;