// mobile/theme.js

export const theme = {
    colors: {
        // Light Mode
        primary: '#146841',
        primaryHover: '#0ba05b',
        secondary: '#6c757d',
        success: '#00ff62',
        error: '#dc3545',
        warning: '#ffc107',
        
        // Background and Surface Colors
        background: '#f4f7f6',
        surface: '#ffffff',
        border: '#dee2e6',
        
        // Text Colors
        textMain: '#212529',
        textMuted: '#6c757d',
        white: '#ffffff',

        // Card Colors (from the WEB theme)
        card: '#9cc59e',
        rowHover: '#bddbce',
    },
    
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 40,
    },
    
    radius: {
        sm: 4,
        md: 8,
        lg: 15,
        round: 50,
    },

    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
        h1: 32,
    }
};

// Dark Mode Theme
export const darkTheme = {
    ...theme,
    colors: {
        ...theme.colors,
        primary: '#2ecc71',
        background: '#0f172a',
        surface: '#1e293b',
        border: '#334155',
        textMain: '#f8fafc',
        textMuted: '#94a3b8',
        card: '#1e293b',
    }
};