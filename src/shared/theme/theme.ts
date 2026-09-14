export const colors = {
  background: '#F3F0E8',
  surface: '#FFFCF6',
  surfaceMuted: '#EAE4D8',
  ink: '#1C2833',
  inkMuted: '#5C6B73',
  inkFaint: '#8A959C',
  primary: '#1D6B57',
  primaryPressed: '#155445',
  primarySoft: '#D7EBE4',
  accent: '#C45C26',
  accentPressed: '#A3491C',
  danger: '#B42318',
  dangerSoft: '#F8E2DF',
  border: '#E4DDD0',
  overlay: 'rgba(28, 40, 51, 0.45)',
  white: '#FFFFFF',
  today: '#1D6B57',
  event: {
    moss: '#1D6B57',
    terracotta: '#C45C26',
    indigo: '#3F5BD2',
    gold: '#C3922E',
    plum: '#8A4D76',
  },
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as const,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
};

export type Theme = typeof theme;
