import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/nwa logo b.png')} style={styles.logo} />
      <Text style={styles.subtitle}>faça login para começar</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.replace('Home')}>
        <Text style={styles.buttonOutlineText}>Cadastrar</Text>
      </TouchableOpacity>
      <Text style={styles.socialText}>faça login com</Text>
      <View style={styles.socialRow}>
        <Text style={styles.socialIcon}>📘</Text>
        <Text style={styles.socialIcon}>✈️</Text>
        <Text style={styles.socialIcon}>🎵</Text>
      </View>
      <View style={styles.organicShape1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e192e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    color: '#2e192e',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#2e192e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderColor: '#fff',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonOutlineText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialText: {
    color: '#fff',
    marginBottom: 8,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  socialIcon: {
    fontSize: 28,
    marginHorizontal: 10,
  },
  organicShape1: {
    position: 'absolute',
    top: -100,
    left: -120,
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 200,
    opacity: 0.07,
    zIndex: 0,
  },
});