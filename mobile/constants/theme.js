/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#146841',
    primaryRgb: '20, 104, 65',
    textMain: '#212529',
    textMuted: '#6c757d',
    background: '#f4f7f6',
    surface: '#ffffff',
    border: '#dee2e6',
    rowBackground: '#9cc59e',
    rowHover: '#bddbce',
    rowShadow: 'rgba(20, 104, 65, 0.08)',
    card: '#9cc59e',
    tabActive: '#146841',
    tabInactive: '#6c757d',
  },
  dark: {
    primary: '#2ecc71', 
    primaryHover: '#58d68d',
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    rowBackground: '#1e293b',
    rowHover: '#334155',
    rowShadow: 'rgba(0, 0, 0, 0.4)',
    card: '#1e293b',
    tabActive: '#2ecc71',
    tabInactive: '#94a3b8',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  round: 50,
};

export const Shadows = {
  light: {
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // For Android
  }
};

