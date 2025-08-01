import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import AppText from './AppText';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <AppText style={styles.title}>
          Monitore e organize seus hábitos em qualquer lugar
        </AppText>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
          <AppText style={styles.buttonText}>Avançar ➔</AppText>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 200,
    paddingLeft: 30,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 10,
    marginLeft: 0,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 25,
    color: '#413a4a',
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 20,
    width: '90%',
    alignSelf: 'flex-start',
    marginLeft: 0,
    fontFamily: 'Poppins',
  },
  button: {
    position: 'absolute',
    bottom: 130,
    right: -40,
    backgroundColor: '#65688a',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 28,
    zIndex: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Poppins',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'Poppins',
  },
});
