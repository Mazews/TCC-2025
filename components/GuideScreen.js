import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';

const getGuideBg = (theme) => theme.guideImage || (theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png'));

export default function GuideScreen({ navigation }) {
  const { theme } = useTheme();
  return (
    <ImageBackground
      source={getGuideBg(theme)}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={[styles.container]}> 
        <AppText style={[styles.title, { color: theme.textSecondary }]}>Guia do Usuário</AppText>
        <View style={[styles.guideBox, { backgroundColor: theme.card }]}> 
          <AppText style={[styles.guideTitle, { color: theme.text }]}>Como registrar seu humor</AppText>
          <AppText style={[styles.guideText, { color: theme.textSecondary }]}>1. Toque no botão "REGISTRE SEU HUMOR" na tela principal do mood tracker. {'\n'}2. Escolha as emoções que está sentindo no momento. {'\n'}3. Salve seu registro.</AppText>
        </View>
        <View style={[styles.guideBox, { backgroundColor: theme.card }]}> 
          <AppText style={[styles.guideTitle, { color: theme.text }]}>Como visualizar o diário de humor</AppText>
          <AppText style={[styles.guideText, { color: theme.textSecondary }]}>1. Toque no botão "DIÁRIO DE HUMOR" na tela principal do mood tracker. {'\n'}2. Veja seus registros recentes e gráficos semanais/mensais.</AppText>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.card }]} onPress={() => navigation.goBack()}>
          <AppText style={[styles.buttonText, { color: theme.text }]}>Voltar</AppText>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 50,
    textAlign: 'center',
  },
  guideBox: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    width: '100%',
    shadowColor: 'rgba(30, 32, 50, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 2,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  guideText: {
    fontSize: 15,
    marginBottom: 8,
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