// theme.ts
export type Theme = {
  background: string;
  surface: string;
  primary: string;
  text: string;
  textMuted: string;
  border: string;
};

export const themes: Record<string, Theme> = {
  light:  { background: '#FFFFFF', surface: '#F5F5F7', primary: '#6C5CE7', text: '#1A1A1A', textMuted: '#6B6B6B', border: '#E5E5EA' },
  dark:   { background: '#121212', surface: '#1E1E1E', primary: '#A29BFE', text: '#F2F2F2', textMuted: '#A0A0A0', border: '#2C2C2E' },
  ocean:  { background: '#F0F8FF', surface: '#DCEEFB', primary: '#0077B6', text: '#023047', textMuted: '#4A6572', border: '#B8D8EA' },
};