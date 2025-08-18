import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';

export default function TipsScreen({ navigation }) {
  const { theme } = useTheme();
  return (
    <ImageBackground
      source={theme.image}
      style={[styles.background, { backgroundColor: theme.background }]}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.card }]}> 
        <AppText style={[styles.title, { color: theme.text }]}>Dicas para Emoções Negativas</AppText>
        {['😢 Tristeza', '😠 Raiva', '😰 Ansiedade', '😳 Vergonha', '😩 Cansaço'].map((emotion, index) => (
          <View key={index} style={[styles.tipBox, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
          >
            <AppText style={[styles.emotion, { color: theme.text }]}>{emotion}</AppText>
            <AppText style={[styles.tip, { color: theme.textSecondary }]}>• Dica 1 para {emotion}. {'\n'}• Dica 2 para {emotion}. {'\n'}• Dica 3 para {emotion}.</AppText>
          </View>
        ))}
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.button }]} onPress={() => navigation.goBack()}>
          <AppText style={[styles.buttonText, { color: theme.buttonText }]}>Voltar</AppText>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
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