import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';

export default function TipsScreen({ navigation }) {
  const { theme } = useTheme();
  return (
    <ImageBackground
      source={theme.image}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.card }]}> 
        <AppText style={[styles.title, { color: theme.text }]}>Dicas para Emoções Negativas</AppText>
        <View style={[styles.tipBox, { backgroundColor: theme.background }]}>
          <AppText style={[styles.emotion, { color: theme.text }]}>😢 Tristeza</AppText>
          <AppText style={[styles.tip, { color: theme.textSecondary }]}>• Converse com alguém de confiança. {'\n'}• Escreva sobre seus sentimentos. {'\n'}• Ouça uma música que te acalme.</AppText>
        </View>
        <View style={[styles.tipBox, { backgroundColor: theme.background }]}>
          <AppText style={[styles.emotion, { color: theme.text }]}>😠 Raiva</AppText>
          <AppText style={[styles.tip, { color: theme.textSecondary }]}>• Pratique respiração profunda. {'\n'}• Faça uma caminhada. {'\n'}• Expresse sua raiva de forma saudável, como desenhar ou escrever.</AppText>
        </View>
        <View style={[styles.tipBox, { backgroundColor: theme.background }]}>
          <AppText style={[styles.emotion, { color: theme.text }]}>😰 Ansiedade</AppText>
          <AppText style={[styles.tip, { color: theme.textSecondary }]}>• Experimente técnicas de relaxamento, como meditação. {'\n'}• Foque no momento presente. {'\n'}• Fale sobre suas preocupações com alguém.</AppText>
        </View>
        <View style={[styles.tipBox, { backgroundColor: theme.background }]}>
          <AppText style={[styles.emotion, { color: theme.text }]}>😳 Vergonha</AppText>
          <AppText style={[styles.tip, { color: theme.textSecondary }]}>• Lembre-se de que todos cometem erros. {'\n'}• Seja gentil consigo mesmo. {'\n'}• Compartilhe seus sentimentos com alguém de confiança.</AppText>
        </View>
        <View style={[styles.tipBox, { backgroundColor: theme.background }]}>
          <AppText style={[styles.emotion, { color: theme.text }]}>😩 Cansaço</AppText>
          <AppText style={[styles.tip, { color: theme.textSecondary }]}>• Respeite seus limites e descanse. {'\n'}• Faça pequenas pausas durante o dia. {'\n'}• Pratique autocuidado.</AppText>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.switchThumb }]} onPress={() => navigation.goBack()}>
          <AppText style={[styles.buttonText, { color: theme.text }]}>Voltar</AppText>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 20,
    textAlign: 'center',
  },
  tipBox: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  emotion: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tip: {
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 