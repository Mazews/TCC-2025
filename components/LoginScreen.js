import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';

const getLoginBg = (theme) => theme.mode === 'dark'
  ? require('../assets/bgdark2.png')
  : require('../assets/loginbg.png');

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  return (
    <ImageBackground
      source={getLoginBg(theme)}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <AppText style={[styles.subtitle, { color: theme.text }]}>faça login para começar</AppText>
        <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Register')}>
          <AppText style={[styles.buttonPrimaryText, { color: theme.text }]}>Cadastrar</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('SignIn')}>
          <AppText style={[styles.buttonPrimaryText, { color: theme.text }]}>Entrar</AppText>
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
    fontSize: 22,
    marginBottom: 40,
    fontWeight: '400',
    textAlign: 'center',
  },
  buttonPrimary: {
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSecondary: {
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 30,
    marginBottom: 0,
  },
  buttonSecondaryText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});