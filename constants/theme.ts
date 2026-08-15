export interface ThemeColors {
  bg: string;
  surface: string;
  raised: string;
  raisedAlt: string;
  border: string;
  borderStrong: string;
  ink: string;
  muted: string;
  faint: string;
  accent: string;
  accentSoft: string;
  accent2: string;
  income: string;
  expense: string;
  saving: string;
  warning: string;
  glassFill: string;
  glassBorder: string;
}

export const palette: { dark: ThemeColors; light: ThemeColors } = {
  dark: {
    bg: '#05050A',
    surface: '#101018',
    raised: '#181822',
    raisedAlt: '#1E1E2A',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.16)',
    ink: '#F5F5F8',
    muted: '#8E8E9A',
    faint: '#5C5C68',
    accent: '#7C5CFF',
    accentSoft: '#9C85FF',
    accent2: '#4C8CFF',
    income: '#34D399',
    expense: '#FB7185',
    saving: '#60A5FA',
    warning: '#FBBF24',
    glassFill: 'rgba(255,255,255,0.045)',
    glassBorder: 'rgba(255,255,255,0.10)',
  },
  light: {
    bg: '#F2F2F6',
    surface: '#FFFFFF',
    raised: '#FFFFFF',
    raisedAlt: '#F7F7FA',
    border: 'rgba(10,10,20,0.07)',
    borderStrong: 'rgba(10,10,20,0.14)',
    ink: '#0B0B10',
    muted: '#6B6B76',
    faint: '#9A9AA5',
    accent: '#6D4AFF',
    accentSoft: '#8E71FF',
    accent2: '#3D6FE0',
    income: '#0F9D6E',
    expense: '#E11D48',
    saving: '#2563EB',
    warning: '#D97706',
    glassFill: 'rgba(255,255,255,0.55)',
    glassBorder: 'rgba(10,10,20,0.08)',
  },
};

export const gradients = {
  accent: ['#7C5CFF', '#4C8CFF'] as const,
  accentDeep: ['#5B3DE0', '#7C5CFF'] as const,
  income: ['#34D399', '#0EA5E9'] as const,
  expense: ['#FB7185', '#F43F5E'] as const,
  saving: ['#60A5FA', '#7C5CFF'] as const,
  balanceCard: ['#171727', '#0B0B14'] as const,
};

export const categoryPalette = [
  '#7C5CFF',
  '#4C8CFF',
  '#34D399',
  '#FBBF24',
  '#FB7185',
  '#60A5FA',
  '#F472B6',
  '#22D3EE',
  '#A78BFA',
  '#FB923C',
];
