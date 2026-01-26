import { StyleSheet, Platform } from 'react-native';
import { Colors, Fonts, Spacing, FontSize } from '../constants/theme';

export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: Colors.light.background 
    },
    header: { 
        padding: Spacing.md, 
        paddingTop: 50, // save room for status bar
        borderBottomWidth: 1, 
        borderColor: Colors.light.border, 
        alignItems: 'center',
        backgroundColor: Colors.light.surface
    },
    title: { 
        fontSize: FontSize.lg, 
        fontWeight: 'bold',
        color: Colors.light.primary,
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
        color: Colors.light.textMain
    },
    centered: { 
        alignItems: 'center',
        padding: Spacing.lg
    },
    fileName: { 
        fontSize: FontSize.md, 
        marginVertical: Spacing.sm, 
        fontWeight: '500',
        color: Colors.light.textMain
    },
    pdfLink: {
        color: Colors.light.primary,
        textDecorationLine: 'underline',
        fontSize: FontSize.md,
        marginTop: Spacing.md
    }
});