import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import CircularSlider from './CircularSlider';
import { useTheme } from './ThemeContext';
import AppText from './AppText';

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
      source={theme.image}
      style={{ flex: 1 }}
      imageStyle={{
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    >
      <View style={[styles.container, { backgroundColor: 'transparent' }]}> 
        <AppText style={[styles.greeting, { color: theme.text }]}>Olá User :)</AppText>
        <AppText style={[styles.dateText, { color: theme.text }]}>
          hoje é {diaSemana},
        </AppText>
        <AppText style={[styles.dateText, { color: theme.text }]}>{dataFormatada}</AppText>
        <CircularSlider onPress={(key) => {
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
        }} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 250,
  },
  greeting: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  dateText: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
});
