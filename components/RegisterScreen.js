import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions } from 'react-native';
import AppText from './AppText';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <ImageBackground
      source={require('../assets/loginbg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.topContent}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <AppText style={styles.title}>Bem vindo (a)!</AppText>
      </View>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="nome inteiro"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <AppText style={styles.buttonText}>voltar</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
          <AppText style={styles.buttonText}>avançar</AppText>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  topContent: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 15,
    marginTop: 100,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins',
  },
  card: {
    width: width > 500 ? 400 : width * 0.75,
    backgroundColor: 'rgba(255,255,255,0.32)',
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 60,
  },
  input: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 32,
    padding: 16,
    marginBottom: 18,
    fontSize: 18,
    color: '#7a8ca4',
    fontWeight: '400',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignSelf: 'center',
  },
  button: {
    width: width > 500 ? 220 : '44%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'lowercase',
  },
}); 