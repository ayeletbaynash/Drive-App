import { StyleSheet, Platform } from 'react-native';
import { Fonts, Spacing, FontSize } from '../constants/theme';

export const createFileViewerStyles = (theme) => StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: theme.background 
    },
    header: { 
        padding: Spacing.md, 
        paddingTop: 50, // save room for status bar
        borderBottomWidth: 1, 
        borderColor: theme.border, 
        alignItems: 'center',
        backgroundColor: theme.surface
    },
    title: { 
        fontSize: FontSize.lg, 
        fontWeight: 'bold',
        color: theme.primary,
        fontFamily: Fonts.sans
    },
    contentBody: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: Spacing.sm 
    },
    fullImage: { 
        width: '100%', 
        height: '100%' 
    },
    textContainer: { 
        flex: 1, 
        width: '100%', 
        padding: Spacing.md 
    },
    textContent: { 
        fontFamily: Fonts.mono,
        fontSize: FontSize.md,
        color: theme.textMain
    },
    centered: { 
        alignItems: 'center',
        padding: Spacing.lg
    },
    fileName: { 
        fontSize: FontSize.md, 
        marginVertical: Spacing.sm, 
        fontWeight: '500',
        color: theme.textMain
    },
    pdfLink: {
        color: theme.primary,
        textDecorationLine: 'underline',
        fontSize: FontSize.md,
        marginTop: Spacing.md
    }
});

export const styles = createFileViewerStyles;