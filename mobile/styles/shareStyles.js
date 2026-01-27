import { StyleSheet } from 'react-native';

export const createShareStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: theme.surface,
        padding: 20,
        borderRadius: 12,
        maxHeight: '80%',
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
        color: theme.textMain,
    },
    addSection: {
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: theme.border,
        marginBottom: 10,
        padding: 8,
        color: theme.textMain,
    },
    rolePickerButton: {
        padding: 10,
        backgroundColor: theme.rowBackground,
        borderRadius: 5,
    },
    inviteButton: {
        marginTop: 15,
        backgroundColor: theme.primary,
        padding: 12,
        borderRadius: 8,
    },
    inviteButtonText: {
        color: theme.white,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    listHeader: {
        fontWeight: '600',
        marginBottom: 10,
        color: theme.textMain,
    },
    list: {
        maxHeight: 200,
    },
    permissionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.border,
    },
    usernameText: {
        fontSize: 14,
        flex: 1,
        color: theme.textMain,
    },
    itemActions: {
        flexDirection: 'row',
    },
    editText: {
        color: theme.primary,
        marginHorizontal: 10,
    },
    deleteText: {
        color: theme.error,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
    },
    closeButtonText: {
        textAlign: 'center',
        color: theme.textMain,
        fontWeight: '600',
    }
});