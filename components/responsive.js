import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Percentual da largura da tela
  @param {number} percent - Ex: wp(90) = 90% da largura
 */
export const wp = (percent) => {
  return (width * percent) / 100;
};

/**
 * Percentual da altura da tela
  @param {number} percent - Ex: hp(30) = 30% da altura
 */
export const hp = (percent) => {
  return (height * percent) / 100;
};

/**
 * Fonte responsiva
 * Baseado em um design para largura de 375px (iPhone 11)
  @param {number} size - tamanho da fonte original
 */
export const RF = (size) => {
  const scale = width / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
