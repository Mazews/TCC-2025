import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/loginbg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.subtitle}>faça login para começar</Text>
        <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonSecondaryText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  subtitle: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 40,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 30,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonPrimaryText: {
    color: '#7a8ca4',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 30,
    marginBottom: 0,
  },
  buttonSecondaryText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});