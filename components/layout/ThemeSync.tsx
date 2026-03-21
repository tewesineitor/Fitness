import { useEffect } from 'react';
import type { Theme } from '../../types/profile';

interface ThemeSyncProps {
  theme: Theme;
}

const getIsDarkTheme = (theme: Theme) => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const ThemeSync: React.FC<ThemeSyncProps> = ({ theme }) => {
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = getIsDarkTheme(theme);
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
    };

    applyTheme();

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    if (theme === 'system') {
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
      if (theme === 'system') {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [theme]);

  return null;
};

export default ThemeSync;
