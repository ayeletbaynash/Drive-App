import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const createCreateFileStyles = (theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: theme.surface,
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: theme.textMain,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: theme.textMain,
    },
    extension: {
        fontSize: 16,
        color: theme.textMuted,
    },
    textArea: {
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        padding: 12,
        height: 120,           
        minHeight: 100,        
        textAlignVertical: 'top', 
        color: theme.textMain, 
        backgroundColor: theme.rowBackground, 
        marginTop: 5,
        marginBottom: 20,      
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    btnPrimary: {
        flex: 1,
        backgroundColor: theme.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnSecondary: {
        flex: 1,
        backgroundColor: theme.rowHover,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnTextPrimary: {
        color: theme.white,
        fontWeight: 'bold',
    },
    btnTextSecondary: {
        color: theme.textMain,
    },
});

export default createCreateFileStyles;