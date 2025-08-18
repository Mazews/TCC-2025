import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from './ThemeContext';

export default function AppIcon({ name, size = 24, color, style }) {
  const { theme } = React.useContext(ThemeContext);
  return (
    <Icon 
      name={name} 
      size={size} 
      color={color || theme.text} 
      style={style} 
    />
  );
}