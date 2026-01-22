import { StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export const styles = StyleSheet.create({
    container: { 
        padding: theme.spacing.xl, 
        paddingTop: 50,
        backgroundColor: theme.colors.background 
    },
    title: { 
        fontSize: theme.fontSize.xl, 
        color: theme.colors.primary,
        textAlign: 'center', 
        marginBottom: 10,
        fontWeight: '700' 
    },
    input: { 
        height: 50, 
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1, 
        borderBottomColor: theme.colors.border, 
        marginBottom: theme.spacing.lg, 
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        color: theme.colors.textMain
    },
    button: { 
        backgroundColor: theme.colors.primary, 
        padding: theme.spacing.md, 
        borderRadius: theme.radius.md, 
        alignItems: 'center',
        marginTop: theme.spacing.sm,
        elevation: 2, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: { 
        color: theme.colors.white, 
        fontWeight: '700', 
        fontSize: theme.fontSize.md 
    },
    errorText: { 
        color: theme.colors.error,  
        marginBottom: 20,
        textAlign: 'center',
        fontSize: theme.fontSize.sm,
        fontWeight: '500',
        padding: 10,
        borderRadius: theme.radius.sm,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: theme.colors.primary,
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
        backgroundColor: theme.colors.surface, 
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingVertical: 12,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    imageButtonTextInner: {
        color: theme.colors.primary, 
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        color: theme.colors.textMain,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'left', 
    },
    requiredNote: {
        fontSize: 12,
        color: theme.colors.error, 
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
        color: theme.colors.textMuted,
        fontSize: theme.fontSize.sm,
    },
    authLink: {
        color: theme.colors.primary,
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