export const colors = {
  background: '#F4EFE4',
  backgroundDeep: '#E7DFD0',
  surface: '#FFFCF7',
  surfaceMuted: '#EFE7D9',
  ink: '#1A242C',
  inkMuted: '#5B676F',
  inkFaint: '#8B959C',
  primary: '#1B6B56',
  primaryPressed: '#145343',
  primarySoft: '#D5EBE3',
  accent: '#C45A24',
  accentPressed: '#A3481B',
  accentSoft: '#F7E3D6',
  danger: '#B42318',
  dangerSoft: '#F8E2DF',
  success: '#1B6B56',
  border: '#E5DDD0',
  borderStrong: '#D4CBBB',
  overlay: 'rgba(26, 36, 44, 0.48)',
  white: '#FFFFFF',
  today: '#1B6B56',
  event: {
    moss: '#1B6B56',
    terracotta: '#C45A24',
    indigo: '#3E58C9',
    gold: '#C3922E',
    plum: '#8A4D76',
  },
  eventSoft: {
    moss: '#D8EDE5',
    terracotta: '#F8E4D6',
    indigo: '#E2E7FA',
    gold: '#F6EAC8',
    plum: '#F1E2EC',
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
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
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

export const shadows = {
  card: {
    shadowColor: '#1A242C',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  float: {
    shadowColor: '#1A242C',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  tab: {
    shadowColor: '#1A242C',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
};

export type Theme = typeof theme;
