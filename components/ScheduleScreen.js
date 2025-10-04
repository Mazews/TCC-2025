import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import AppText from './AppText';
import { ThemeContext } from './ThemeContext';

const { width } = Dimensions.get('window');

function ScheduleScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  return (
    <ImageBackground
      source={theme.mode === 'dark' ? require('../assets/bgdark2.png') : require('../assets/loginbg.png')}
      style={[styles.background, { backgroundColor: theme.background }]}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <AppText style={[styles.title, { color: theme.text }]}>Agendamento</AppText>
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }}>
          <AppText style={[styles.termsText, { color: theme.textSecondary }]}>Agendamentos futuros aqui!</AppText>
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
    borderRadius: 36,
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    maxWidth: 400,
  },
  title: { 
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: 'rgba(45, 48, 77, 1)',
    marginBottom: 32,
  },
   scroll: {
    width: '100%',
    maxHeight: 220,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 16,
    color: 'rgba(45, 48, 77, 1)',
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
    color: 'rgba(45, 48, 77, 1)',
    fontWeight: '400',
},
});

export default ScheduleScreen;