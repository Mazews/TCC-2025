import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AppText from './AppText';

const { width } = Dimensions.get('window');

const termsText = `Bem-vindo ao nosso aplicativo!\n\nSua privacidade é importante para nós.\n\n- Não compartilhamos seus dados pessoais com terceiros.\n- Suas informações são usadas apenas para melhorar sua experiência no app.\n- Você pode solicitar a exclusão dos seus dados a qualquer momento.\n\nAo continuar usando o app, você concorda com estes termos.`;

export default function TermsScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/plainbg.png')}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={styles.card}>
        <AppText style={styles.title}>Termos de Privacidade</AppText>
        <ScrollView style={styles.scroll} contentContainerStyle={{paddingBottom: 20}}>
          <AppText style={styles.termsText}>{termsText}</AppText>
        </ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AppText style={styles.backButtonText}>voltar</AppText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width > 500 ? 380 : width * 0.55,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 36,
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    maxWidth: 400,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d304d',
    marginBottom: 32,
  },
  scroll: {
    width: '100%',
    maxHeight: 220,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 16,
    color: '#2d304d',
    lineHeight: 24,
    textAlign: 'left',
  },
  backButton: {
    width: '60%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 22,
    color: '#2d304d',
    fontWeight: '400',
  },
}); 