import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ImageBackground } from 'react-native';
import SideMenu from './SideMenu';

export default function HomeScreen({ navigation }) {
  // Array com os dias da semana 
  const diasSemana = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  // dia da semana atual
  const diaAtual = diasSemana[new Date().getDay()];

  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuNavigate = (key) => {
    setMenuVisible(false);
    // Navegação básica, personalize conforme suas rotas
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
      case 'Config':
        navigation.navigate('Config');
        break;
      case 'Guide':
        navigation.navigate('Guide');
        break;
      case 'Support':
        navigation.navigate('Support');
        break;
      case 'Terms':
        navigation.navigate('Terms');
        break;
      case 'Logout':
        // Adicione lógica de logout aqui
        break;
      default:
        break;
    }
  };

  return (
    <ImageBackground
      source={require('../assets/homebg.png')}
      style={{ flex: 1 }}
      imageStyle={{
        top: -260,
        left: 0,
        width: 420,
        height: 1400,
        resizeMode: 'contain',
      }}
      
    >
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <View style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="pesquisar"
            placeholderTextColor="#fff"
          />
          <Image source={require('../assets/search.png')} style={styles.searchIcon} />
        </View>

        {/* Dia da semana */}
        <Text style={styles.dayText}>{diaAtual}</Text>

        {/* Frase motivacional */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>Carpe Diem.</Text>
          <Text style={styles.quoteSubtext}>"aproveite o dia, viva o agora"</Text>
        </View>

        {/* Conteúdo diário */}
        <Text style={styles.sectionTitle}>Meu conteúdo diário • Hoje</Text>
        <View style={styles.dailyContentRow}>
          <TouchableOpacity
            style={styles.symptomCard}
            onPress={() => navigation.navigate('MoodTracker')}
          >
            <Text style={styles.symptomText}>registre seus sintomas aqui!</Text>
            <Text style={styles.plusIcon}>＋</Text>
          </TouchableOpacity>
          <View style={styles.emptyCard} />
          <View style={styles.emptyCard} />
        </View>

        {/* Vícios */}
        <Text style={styles.sectionTitle}>Tarefas • Hoje</Text>
        <View style={styles.addictionCard} />

        {/* Barra de navegação inferior */}
        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarItem}>home</Text>
          <Text style={styles.bottomBarItem}>dash</Text>
          <Image source={require('../assets/sun.png')} style={styles.bottomBarIcon} />
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5}} onPress={() => navigation.navigate('MoodTransition')}>
            <Text style={styles.bottomBarItem}>tracker</Text>
          </TouchableOpacity>
          <Text style={styles.bottomBarItem}>chat</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 70,
    paddingHorizontal: 18,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  menuIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:-30,
  },
  menuLine: {
    width: 22,
    height: 3,
    backgroundColor: '#2d304d',
    marginVertical: 2,
    borderRadius: 2,
  },
  logo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    marginTop:-40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5c6082',
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    height: 38,
    marginTop:-10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  dayText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quoteCard: {
    backgroundColor: 'rgba(23, 24, 55, 0.5)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  quoteText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quoteSubtext: {
    color: '#bbaacc',
    fontSize: 14,
    fontStyle: 'italic',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  dailyContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  symptomCard: {
    flex: 1,
    backgroundColor: 'rgba(92, 96, 130, 0.5)',
    borderRadius: 18,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  symptomText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  plusIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  emptyCard: {
    flex: 1,
    backgroundColor: 'rgba(92, 96, 130, 0.5)',
    borderRadius: 18,
    marginLeft: 8,
    minHeight: 80,
  },
  addictionCard: {
    backgroundColor: 'rgba(92, 96, 130, 0.5)',
    borderRadius: 18,
    minHeight: 50,
    marginBottom: 18,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(92, 96, 130, 0.6)',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 18,
    alignItems: 'center',
  },
  bottomBarItem: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  selectedBarItem: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  bottomBarIcon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    marginRight: 16,
    marginLeft: 0,
  },
});
