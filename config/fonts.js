// Mapeamento lógico para uso em componentes (ex: config.fonts.Poppins.bold)
export const fonts = {
  Poppins: {
    regular: 'Poppins-Regular',
    bold: 'Poppins-Bold',
    light: 'Poppins-Light',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
  },
};

// Mapeamento usado para registrar os arquivos reais com expo-font (Font.loadAsync)
// As chaves aqui devem corresponder exatamente aos nomes usados em fontFamily nos componentes.
export const fontFiles = {
  'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
  'Poppins-Italic': require('../assets/fonts/Poppins/Poppins-Italic.ttf'),
  'Poppins-Light': require('../assets/fonts/Poppins/Poppins-Light.ttf'),
  'Poppins-LightItalic': require('../assets/fonts/Poppins/Poppins-LightItalic.ttf'),
  'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
  'Poppins-MediumItalic': require('../assets/fonts/Poppins/Poppins-MediumItalic.ttf'),
  'Poppins-SemiBold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  'Poppins-SemiBoldItalic': require('../assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf'),
  'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
  'Poppins-BoldItalic': require('../assets/fonts/Poppins/Poppins-BoldItalic.ttf'),
  'Poppins-ExtraBold': require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  'Poppins-ExtraBoldItalic': require('../assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf'),
  'Poppins-Black': require('../assets/fonts/Poppins/Poppins-Black.ttf'),
  'Poppins-BlackItalic': require('../assets/fonts/Poppins/Poppins-BlackItalic.ttf'),
  'Poppins-ExtraLight': require('../assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
  'Poppins-ExtraLightItalic': require('../assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf'),
  'Poppins-Thin': require('../assets/fonts/Poppins/Poppins-Thin.ttf'),
  'Poppins-ThinItalic': require('../assets/fonts/Poppins/Poppins-ThinItalic.ttf'),
};