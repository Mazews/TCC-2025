import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import CircularSlider from './CircularSlider';
import { useTheme } from './ThemeContext';
import AppText from './AppText';
import plainbg from '../assets/plainbg.png';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();

  const diasSemana = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];

  const dataAtual = new Date();
  const diaSemana = diasSemana[dataAtual.getDay()];
  const dia = String(dataAtual.getDate()).padStart(2, '0');
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const ano = dataAtual.getFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;

  return (
    <ImageBackground
      source={plainbg}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View style={styles.overlay} />
      <View style={styles.rowContainer}>
        <View style={styles.leftContent}>
          <AppText style={[styles.greeting, { color: theme.text }]}>
            Olá User :)
          </AppText>
          <AppText style={styles.dateText}>
            hoje é {diaSemana}, {dataFormatada}
          </AppText>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.sliderAlignWrapper}>
            <CircularSlider
              style={styles.slider}
              onPress={(key) => {
                switch (key) {
                  case 'Profile':
                    navigation.navigate('Profile');
                    break;
                  case 'Tasks':
                    navigation.navigate('Tasks');
                    break;
                  case 'Activity':
                    navigation.navigate('Activity');
                    break;
                  case 'Dashboard':
                    navigation.navigate('Dashboard');
                    break;
                  case 'MoodTracker':
                    navigation.navigate('MoodTracker');
                    break;
                  case 'Config':
                    navigation.navigate('Config');
                    break;
                  case 'Guide':
                    navigation.navigate('Guide');
                    break;
                  case 'Support':
                    navigation.navigate('Help');
                    break;
                  case 'Terms':
                    navigation.navigate('Terms');
                    break;
                  case 'Logout':
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    break;
                  default:
                    break;
                }
              }}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  bgImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 0,
  },
  greeting: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'left',
    fontFamily: 'Poppins',
    letterSpacing: 0.5,

  },
  dateText: {
    fontSize: 25,
    color: '#fff',
    fontFamily: 'Poppins',
    textAlign: 'left',
    marginBottom: 0,
    opacity: 0.85,
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  sliderAlignWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
    width: '100%',
  },
  slider: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 32,
    padding: 0,
  },
});
