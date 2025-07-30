import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const QUOTES = [
  'Carpe diem.',
  'Acredite em você e tudo será possível.',
  'Cada dia é uma nova oportunidade para recomeçar.',
  'A persistência realiza o impossível.',
  'Grandes coisas nunca vêm de zonas de conforto.',
  'A felicidade não é algo pronto. Ela vem de suas próprias ações.',
  'O sucesso é a soma de pequenos esforços, dia após dia.',
  'Seja a mudança que você deseja ver no mundo.',
  'Você é mais forte do que imagina.'
];

export default function QuoteScreen({ navigation }) {
  const dailyQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[idx];
  }, []);

  return (
    <ImageBackground
      source={require('../assets/quotebg.png')}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={38} color="#fff" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.subtitle}>frase do dia</Text>
        <Text style={styles.quoteText}>{dailyQuote}</Text>
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
  backButton: {
    position: 'absolute',
    top: 36,
    left: 18,
    zIndex: 2,
    padding: 8,
    // Se houver texto, fonte Poppins
    // fontFamily: 'Poppins',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 32,
    fontStyle: 'italic',
    color: '#fff',
    fontFamily: 'serif', // Mantém serifada
    marginBottom: 18,
    textAlign: 'center',
    textTransform: 'lowercase',
    opacity: 0.9,
  },
  quoteText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontFamily: 'serif', // Mantém serifada
    textAlign: 'center',
    lineHeight: 56,
    opacity: 0.98,
  },
}); 

