import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, ImageBackground, Alert } from 'react-native';
import AppText from './AppText';
import { ThemeContext } from './ThemeContext';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 370;

  const ProfileScreen = ({ navigation }) => { 
const { theme } = React.useContext(ThemeContext);

  // Mock de dados do perfil (substituir por dados reais da API futuramente)
  const profile = {
    nome: 'José Maria',
    sobrenome: 'Silva',
    email: 'jose@email.com',
    username: 'josemaria',
    dataEntrada: '01/01/2024',
    profilePic: require('../assets/profile.png'),
  };

  const handleLogout = () => {
    Alert.alert(
      'Tem certeza que deseja sair?',
      '',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ImageBackground
        source={theme.mode === 'dark' ? require('../assets/registrobgdark.png') : require('../assets/plainbg.png')}
        style={[styles.background, { backgroundColor: theme.background }]}
        imageStyle={{ resizeMode: 'cover' }}
      >
  <View style={[styles.card, isSmallScreen && styles.cardSmall, { backgroundColor: theme.card }]}> 
          <View style={styles.profileHeader}>
            <Image
              source={profile.profilePic}
              style={[styles.profileIcon, isSmallScreen && styles.profileIconSmall]}
            />
            <View style={styles.profileInfo}>
              <AppText style={[styles.profileName, isSmallScreen && styles.profileNameSmall, { color: theme.text }]}>{profile.nome} {profile.sobrenome}</AppText>
              <AppText style={[styles.profileDate, isSmallScreen && styles.profileDateSmall, { color: theme.text }]}>{profile.dataEntrada}</AppText>
              <AppText style={[styles.profileEmail, { color: theme.text }]}>{profile.email}</AppText>
              <AppText style={[styles.profileUsername, { color: theme.text }]}>{profile.username}</AppText>
            </View>
          </View>
          <View style={styles.buttonList}>
            <TouchableOpacity style={[styles.button, isSmallScreen && styles.buttonSmall, { backgroundColor: theme.button }]} onPress={() => navigation.navigate('EditProfileScreen')}>
              <AppText style={[styles.buttonText, isSmallScreen && styles.buttonTextSmall, { color: theme.buttonText }]}>editar perfil</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, isSmallScreen && styles.buttonSmall, { backgroundColor: theme.button }]} onPress={() => navigation.navigate('Config')}>
              <AppText style={[styles.buttonText, isSmallScreen && styles.buttonTextSmall, { color: theme.buttonText }]}>configurações</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, isSmallScreen && styles.buttonSmall, { backgroundColor: theme.button }]} onPress={handleLogout}>
              <AppText style={[styles.buttonText, isSmallScreen && styles.buttonTextSmall, { color: theme.buttonText }]}>logout</AppText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.backButton, isSmallScreen && styles.backButtonSmall, { backgroundColor: theme.button }]} onPress={() => navigation.goBack()}>
            <AppText style={[styles.backButtonText, isSmallScreen && styles.backButtonTextSmall, { color: theme.buttonText }]}>voltar</AppText>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  cardSmall: {
    width: width * 0.85,
    borderRadius: 22,
    paddingVertical: 36,
    paddingHorizontal: 6,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
    justifyContent: 'flex-start',
    paddingLeft: 18,
  },
  profileIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: '#2d304d',
    resizeMode: 'contain',
    marginRight: 18,
  },
  profileIconSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    marginRight: 8,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d304d',
    textAlign: 'left',
  },
  profileNameSmall: {
    fontSize: 17,
  },
  profileDate: {
    fontSize: 17,
    color: '#5c6082',
    marginTop: 2,
    textAlign: 'left',
  },
  profileDateSmall: {
    fontSize: 13,
  },
  buttonList: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  button: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 32,
    paddingVertical: 20,
    marginBottom: 18,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 32,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonSmall: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingLeft: 16,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 22,
    color: '#2d304d',
    fontWeight: '400',
  },
  buttonTextSmall: {
    fontSize: 15,
  },
  backButton: {
    width: '60%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
  backButtonSmall: {
    width: '80%',
    borderRadius: 18,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: '#2d304d',
    fontWeight: '400',
  },
  backButtonTextSmall: {
    fontSize: 15,
  },
  profileEmail: {
    fontSize: 15,
    color: '#5c6082',
    marginTop: 2,
    textAlign: 'left',
  },
  profileUsername: {
    fontSize: 15,
    color: '#5c6082',
    marginTop: 2,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});