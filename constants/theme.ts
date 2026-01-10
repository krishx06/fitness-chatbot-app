import { Platform } from 'react-native';

const brandPurple = '#5B2EFF';
const brandPurpleMid = '#7C4DFF';
const brandPurpleSoft = '#B86EFF';

const tintColorLight = brandPurpleMid;
const tintColorDark = '#FFFFFF';

export const Colors = {
  light: {

    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',

    background: '#FFFFFF',
    card: '#F8F9FC',
    subtle: '#F1F5FF',

    tint: tintColorLight,
    brandPrimary: brandPurple,
    brandSecondary: brandPurpleMid,
    brandAccent: brandPurpleSoft,

    border: '#E6E8EF',
    icon: '#687076',

    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    userBubble: '#0F172A',
    aiBubble: '#F1F5FF',

    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  dark: {

    text: '#ECEDEE',
    textSecondary: '#C7CDD3',
    textMuted: '#9BA1A6',

    background: '#151718',
    card: '#1C1F23',
    subtle: '#22262B',

    tint: tintColorDark,
    brandPrimary: brandPurpleMid,
    brandSecondary: brandPurpleSoft,
    brandAccent: brandPurpleSoft,

    border: '#2A2F35',
    icon: '#9BA1A6',

    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    userBubble: '#0F172A',
    aiBubble: '#22262B',

    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
};

export const Gradients = {
  primary: [brandPurple, brandPurpleMid, brandPurpleSoft],
  soft: ['#F1F5FF', '#FFFFFF'],
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
};
