import React from 'react';
import { View, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import CircularSlider from './CircularSlider';
import { useTheme } from './ThemeContext';
import AppText from './AppText';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp, RF } from '../components/responsive'; 

const getHomeBg = (theme) => theme.mode === 'dark'
  ? require('../assets/bgdark.png')
  : require('../assets/plainbg.png');

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
      source={getHomeBg(theme)}
      style={[styles.bg, { backgroundColor: theme.background }]}
      imageStyle={styles.bgImage}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <View style={styles.headerLeft}>
          <AppText style={[styles.greeting, { color: theme.text }]}>Olá User :)</AppText>
          <AppText style={[styles.dateText, { color: theme.text }]}>
            hoje é {diaSemana}, {dataFormatada}
          </AppText>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: theme.card }]}>
            <Icon name="bell" size={RF(20)} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.floatingCard, { backgroundColor: theme.card }]}>
        <Icon name="search" size={RF(18)} color="#fff" style={{ marginRight: wp(2), opacity: 0.7 }} />
        <TextInput
          placeholder="Pesquisar..."
          placeholderTextColor={theme.textSecondary}
          style={styles.searchInput}
        />
      </View>

      {/* Card de destaque do dia */}
      <View style={[styles.floatingCard, styles.featuredCard, { backgroundColor: theme.card }]}>
        <View style={{ flex: 1 }}>
          <AppText style={[styles.featuredTitle, { color: theme.text }]}>Frase do Dia</AppText>
          <AppText style={[styles.featuredDesc, { color: theme.textSecondary }]}>
            Descubra algo novo e interessante
          </AppText>
          <View style={[styles.exploreBtn, { backgroundColor: theme.card }]}>
            <AppText style={[styles.exploreText, { color: theme.text }]}>Acessar</AppText>
          </View>
        </View>
        <View style={[styles.featuredIconBox, { color: theme.card }]}>
          <Icon name="star" size={RF(24)} color={theme.text} />
        </View>
      </View>

      {/* CircularSlider estilizado */}
      <View style={styles.sliderContainer}>
        <CircularSlider
          style={styles.slider}
          onPress={async (key) => {
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
                await AsyncStorage.removeItem('userToken');
                navigation.replace('SignIn');
                break;
              default:
                break;
            }
          }}
        />
      </View>

      {/* Atividades Recentes */}
      <View style={styles.activitiesSection}>
        <AppText style={[styles.activitiesTitle, { color: theme.text }]}>Atividades Recentes</AppText>
        <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
          <View style={[styles.activityIconA]}>
            <AppText style={[styles.activityIconText, { color: theme.text }]}>A</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[styles.activityTitle, { color: theme.text }]}>Atividade Recente</AppText>
            <AppText style={[styles.activityTime, { color: theme.textSecondary }]}>Há 2 horas</AppText>
          </View>
          <View style={[styles.activityStatusA]} />
        </View>

        <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
          <View style={[styles.activityIconB]}>
            <AppText style={[styles.activityIconText, { color: theme.text }]}>B</AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[styles.activityTitle, { color: theme.text }]}>Outra Atividade</AppText>
            <AppText style={[styles.activityTime, { color: theme.textSecondary }]}>Ontem</AppText>
          </View>
          <View style={[styles.activityStatusB]} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: {
     resizeMode: 'cover',
      width: '100%',
       height: '100%' 
      },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(8),
    paddingTop: hp(6),
    marginBottom: hp(2),
  },
  headerLeft: { flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: wp(3) },

  iconCircle: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },

  greeting: {
    fontSize: RF(28),
    fontWeight: '400',
    marginBottom: hp(0.5),
    marginTop: hp(2),
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  dateText: {
     fontSize: RF(16)
     , opacity: 0.85,
      fontFamily: 'Poppins' 
    },

  floatingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(6),
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    marginHorizontal: wp(8),
    marginBottom: hp(2),
    shadowColor: 'rgba(255, 255, 255, 0)',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: 'rgba(255, 255, 255, 1)',
    fontSize: RF(16),
    fontFamily: 'Poppins',
  },

  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(3),
    borderRadius: wp(6),
  },
  featuredTitle: {
     fontSize: RF(20),
     fontWeight: '600',
     fontFamily: 'Poppins', 
    marginTop: hp(1),
    },

  featuredDesc: {
     fontSize: RF(14), 
     opacity: 0.8, 
     fontFamily: 'Poppins', 
    marginBottom: hp(1),
    },

  exploreBtn: {
    borderRadius: wp(4),
    paddingHorizontal: wp(6),
    paddingVertical: hp(1),
    alignSelf: 'flex-start',
    marginBottom: hp(1),
  },
  exploreText: {
     fontWeight: '500',
      fontSize: RF(13),
       fontFamily: 'Poppins' 
      },

  featuredIconBox: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(4),
  },

  sliderContainer: {
    marginTop: -hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  activitiesSection: {
     marginTop: -hp(3),
      marginBottom: -hp(-3),
       paddingHorizontal: wp(6) 
      },

  activitiesTitle: {
     fontSize: RF(20),
      fontWeight: '600',
       marginBottom: hp(2),
       marginTop: hp(1),
        fontFamily: 'Poppins-Bold' 
      },

  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(5),
    padding: wp(5),
    marginBottom: hp(2),
  },
  activityIconA: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: 'rgba(26, 139, 55, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  activityIconB: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
      backgroundColor: 'rgba(52, 120, 246, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  activityIconText: 
  { fontWeight: 'bold', fontSize: RF(16), fontFamily: 'Poppins' },

  activityTitle: 
  { fontWeight: '600', fontSize: RF(14), fontFamily: 'Poppins' },

  activityTime: 
  { opacity: 0.7, fontSize: RF(12), fontFamily: 'Poppins' },

  activityStatusA: 
  { width: wp(4), height: wp(4), borderRadius: wp(2), marginLeft: wp(2) },
  backgroundColor: 'rgba(52, 199, 89, 0.4)',

  activityStatusB: 
  { width: wp(4), height: wp(4), borderRadius: wp(2), marginLeft: wp(2) },
  backgroundColor: 'rgba(52, 120, 246, 0.4)',
});

