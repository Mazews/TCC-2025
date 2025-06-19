import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';

export default function GuideScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/loginbg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Guia do Usuário</Text>
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>Como registrar seu humor</Text>
          <Text style={styles.guideText}>
            1. Toque no botão "REGISTRE SEU HUMOR" na tela principal do mood tracker.
            {'\n'}2. Escolha as emoções que está sentindo no momento.
            {'\n'}3. (Opcional) Escreva o que te fez sentir assim no campo de texto.
            {'\n'}4. Toque em "Enviar" para salvar seu registro.
          </Text>
        </View>
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>Como visualizar o diário de humor</Text>
          <Text style={styles.guideText}>
            1. Toque no botão "DIÁRIO DE HUMOR" na tela principal do mood tracker.
            {'\n'}2. Veja seus registros recentes e gráficos semanais/mensais.
            {'\n'}3. Use os botões "Semana" e "Mês" para alternar a visualização dos dados.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    color: '#2d3150',
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 20,
    textAlign: 'center',
  },
  guideBox: {
    backgroundColor: '#fff',
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
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3150',
    marginBottom: 6,
  },
  guideText: {
    fontSize: 15,
    color: '#2d3150',
    marginBottom: 8,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#5c6082',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 