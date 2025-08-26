import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import AppText from './AppText';
import { ThemeContext } from './ThemeContext';

const { width } = Dimensions.get('window');

const termsText = `Bem-vindo ao nosso aplicativo!\n\nSua privacidade é importante para nós.\n\n- Não compartilhamos seus dados pessoais com terceiros.\n- Suas informações são usadas apenas para melhorar sua experiência no app.\n- Você pode solicitar a exclusão dos seus dados a qualquer momento.\n\nAo continuar usando o app, você concorda com estes termos.`;

function TermsScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  return (
    <ImageBackground
      source={theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png')}
      style={[styles.background, { backgroundColor: theme.background }]}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <AppText style={[styles.title, { color: theme.text }]}>Termos de Privacidade</AppText>
        <ScrollView style={styles.scroll} contentContainerStyle={{paddingBottom: 20}}>
          <AppText style={[styles.termsText, { color: theme.textSecondary }]}>{termsText}</AppText>
        </ScrollView>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.backButton }]} onPress={() => navigation.goBack()}>
          <AppText style={[styles.backButtonText, { color: theme.text }]}>voltar</AppText>
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
    width: width > 500 ? 380 : width * 0.65,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 36,
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    maxWidth: 400,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
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

export default TermsScreen;