import { StyleSheet } from 'react-native';

export const shareStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        maxHeight: '80%',
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
    },
    addSection: {
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 8,
    },
    rolePickerButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    inviteButton: {
        marginTop: 15,
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
    },
    inviteButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    listHeader: {
        fontWeight: '600',
        marginBottom: 10,
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
        borderBottomColor: '#eee',
    },
    usernameText: {
        fontSize: 14,
        flex: 1,
    },
    itemActions: {
        flexDirection: 'row',
    },
    editText: {
        color: '#007AFF',
        marginHorizontal: 10,
    },
    deleteText: {
        color: '#FF3B30',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
    },
    closeButtonText: {
        textAlign: 'center',
        color: '#555',
        fontWeight: '600',
    }
});