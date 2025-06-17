import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/nwa logo s fundo.png')} style={styles.logo} />
      <Text style={styles.title}>Monitore e organize seus hábitos em qualquer lugar</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>Avançar ➔</Text>
      </TouchableOpacity>
      <View style={styles.organicShape1} />
      <View style={styles.organicShape2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: '#2e192e',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2e192e',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    zIndex: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  organicShape1: {
    position: 'absolute',
    top: -80,
    left: -100,
    width: 250,
    height: 250,
    backgroundColor: '#2e192e',
    borderRadius: 200,
    opacity: 0.15,
    zIndex: 0,
  },
  organicShape2: {
    position: 'absolute',
    bottom: -80,
    right: -100,
    width: 250,
    height: 250,
    backgroundColor: '#2e192e',
    borderRadius: 200,
    opacity: 0.15,
    zIndex: 0,
  },
});
