import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

const THEME_KEY = 'APP_THEME';

const lightTheme = {
  mode: 'light',
  background: 'rgba(255, 255, 255, 1)',
  card: 'rgba(255, 255, 255, 0.3)',
  text: 'rgba(255, 255, 255, 1)',
  font: 'Poppins',
  textSecondary: 'rgba(45, 48, 77, 1)',
  switchThumb: 'rgba(255, 255, 255, 0.5)',
  switchThumb2: 'rgba(255, 255, 255, 0.4)',
  switchTrack: 'rgba(204, 204, 204, 1)',
  backButton: 'rgba(255, 255, 255, 0.25)',
  image: require('../assets/plainbg.png'),
  quoteImage: require('../assets/quotebg.png'),
  registroImage: require('../assets/registrobg.png'),
  guideImage: require('../assets/loginbg.png'),
  helpImage: require('../assets/loginbg.png'),
  termsImage: require('../assets/loginbg.png'),
  tasksImage: require('../assets/loginbg.png'),
};

const darkTheme = {
  mode: 'dark',
  background: 'rgba(24, 26, 42, 1)',
  card: 'rgba(30, 32, 50, 0.5)',
  text: 'rgba(255, 255, 255, 1)',
  font: 'Poppins',
  textSecondary: 'rgba(191, 194, 226, 1)',
  switchThumb: 'rgba(45, 48, 77, 1)',
  switchThumb2: 'rgba(45, 48, 77, 0.7)',
  switchTrack: 'rgba(69, 69, 69, 1)',
  backButton: 'rgba(30,32,50,0.9)',
  image: require('../assets/bgdark.png'),
  quoteImage: require('../assets/quotebgdark.png'),
  registroImage: require('../assets/registrobgdark.png'),
  guideImage: require('../assets/bgdark2.png'),
  helpImage: require('../assets/bgdark2.png'),
  termsimage: require('../assets/bgdark2.png'),
  tasksImage: require('../assets/bgdark2.png'),
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

// also export ThemeContext for direct use in components
// ThemeContext is already exported at declaration: export const ThemeContext = createContext();