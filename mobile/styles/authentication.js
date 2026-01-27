import { StyleSheet } from 'react-native';

export const createAuthenticationStyles = (theme) => StyleSheet.create({
    container: { 
        padding: 20, 
        paddingTop: 50,
        backgroundColor: theme.background 
    },
    title: { 
        fontSize: 24, 
        color: theme.primary,
        textAlign: 'center', 
        marginBottom: 10,
        fontWeight: '700' 
    },
    input: { 
        height: 50, 
        backgroundColor: theme.surface,
        borderBottomWidth: 1, 
        borderBottomColor: theme.border, 
        marginBottom: 16, 
        paddingHorizontal: 8,
        borderRadius: 4,
        color: theme.textMain
    },
    button: { 
        backgroundColor: theme.primary, 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center',
        marginTop: 8,
        elevation: 2, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: { 
        color: theme.white, 
        fontWeight: '700', 
        fontSize: 16 
    },
    errorText: { 
        color: theme.error,  
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
        padding: 10,
        borderRadius: 4,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: theme.primary,
    },
    imageButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
        width: '100%',
    },
    halfButton: {
        flex: 1,
        backgroundColor: theme.surface, 
        borderWidth: 1,
        borderColor: theme.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    imageButtonTextInner: {
        color: theme.primary, 
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        color: theme.textMain,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'left', 
    },
    requiredNote: {
        fontSize: 12,
        color: theme.error, 
        marginBottom: 15,
        textAlign: 'left',
        fontStyle: 'italic',
    },
    // for Login screen
    linkContainer: {
        marginTop: 15,
        alignItems: 'center'
    },
    linkText: {
        color: theme.textMuted,
        fontSize: 12,
    },
    authLink: {
        color: theme.primary,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    logoWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        overflow: 'visible',
    },
});