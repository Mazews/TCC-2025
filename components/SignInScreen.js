import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions, ActivityIndicator, Alert, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    Platform.OS === 'android'
      ? 'https://backend-feelflow-core.onrender.com'
      : 'https://backend-feelflow-core.onrender.com';

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando requisição para:', `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: senha,
        }),
      });

      console.log('Status da resposta:', response.status);

      const data = await response.json();
      console.log('Resposta completa da API:', data);

      if (!response.ok) {
        throw new Error(data.msg || 'Erro na autenticação');
      }

      if (data.msg && data.msg.includes('sucesso')) {
        navigation.replace('Home');
      } else {
        Alert.alert('Erro', data.msg || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      Alert.alert('Erro', error.message || 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/loginbg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.topContent}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Bem vindo (a) de{"\n"}volta!</Text>
      </View>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          editable={!loading}
        />
      </View>
      <View style={styles.bottomRow}>
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.buttonText}>voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>avançar</Text>
          )}
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
    marginBottom: 10,
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
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
  },
}); 