import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';

export default function TipsScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/loginbg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dicas para Emoções Negativas</Text>
        <View style={styles.tipBox}>
          <Text style={styles.emotion}>😢 Tristeza</Text>
          <Text style={styles.tip}>• Converse com alguém de confiança. 
            {'\n'}• Escreva sobre seus sentimentos. 
            {'\n'}• Ouça uma música que te acalme.</Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={styles.emotion}>😠 Raiva</Text>
          <Text style={styles.tip}>• Pratique respiração profunda.
             {'\n'}• Faça uma caminhada.
             {'\n'}• Expresse sua raiva de forma saudável, como desenhar ou escrever.</Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={styles.emotion}>😰 Ansiedade</Text>
          <Text style={styles.tip}>• Experimente técnicas de relaxamento, como meditação.
             {'\n'}• Foque no momento presente.
             {'\n'}• Fale sobre suas preocupações com alguém.</Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={styles.emotion}>😳 Vergonha</Text>
          <Text style={styles.tip}>• Lembre-se de que todos cometem erros.
             {'\n'}• Seja gentil consigo mesmo.
             {'\n'}• Compartilhe seus sentimentos com alguém de confiança.</Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={styles.emotion}>😩 Cansaço</Text>
          <Text style={styles.tip}>• Respeite seus limites e descanse.
            {'\n'}• Faça pequenas pausas durante o dia.
            {'\n'}• Pratique autocuidado.</Text>
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
  tipBox: {
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
  emotion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3150',
    marginBottom: 8,
  },
  tip: {
    fontSize: 16,
    color: '#2d3150',
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