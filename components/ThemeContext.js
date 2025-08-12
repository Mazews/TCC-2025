import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const THEME_KEY = 'APP_THEME';

const lightTheme = {
  mode: 'light',
  background: '#fff',
  card: 'rgba(255, 255, 255, 0.5)',
  text: 'rgb(255, 255, 255)',
  font: 'Poppins',
  textSecondary: 'rbga(255, 255, 255, 0.85)',
  switchThumb: '#fff',
  switchTrack: '#ccc',
  backButton: 'rgba(255, 255, 255, 0.5)',
  image: require('../assets/plainbg.png'),
};

const darkTheme = {
  mode: 'dark',
  background: '#181a2a',
  card: 'rgba(30,32,50,0.85)',
  text: '#fff',
  font: 'Poppins',
  textSecondary: '#bfc2e2',
  switchThumb: '#2d304d',
  switchTrack: '#444',
  backButton: 'rgba(30,32,50,0.9)',
  image: require('../assets/bgdark.png'), 
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === 'dark') setTheme(darkTheme);
      else if (saved === 'light') setTheme(lightTheme);
      else {
        
        const sys = Appearance.getColorScheme();
        setTheme(sys === 'dark' ? darkTheme : lightTheme);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = theme.mode === 'light' ? darkTheme : lightTheme;
    setTheme(next);
    await AsyncStorage.setItem(THEME_KEY, next.mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}