import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function AppText({ style, children, weight = 'regular', italic, ...props }) {
  // Define a fonte Poppins correta baseada nos props
  let fontFamily = 'Poppins-Regular';
  
  if (weight === 'bold') {
    fontFamily = italic ? 'Poppins-BoldItalic' : 'Poppins-Bold';
  } else if (weight === 'light') {
    fontFamily = italic ? 'Poppins-LightItalic' : 'Poppins-Light';
  } else if (weight === 'medium') {
    fontFamily = italic ? 'Poppins-MediumItalic' : 'Poppins-Medium';
  } else if (weight === 'semibold') {
    fontFamily = italic ? 'Poppins-SemiBoldItalic' : 'Poppins-SemiBold';
  } else if (italic) {
    fontFamily = 'Poppins-Italic';
  }

  const textStyle = [
    {
      fontFamily,
    },
    style
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}