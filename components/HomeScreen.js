import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

export default function HomeScreen({ navigation }) {
  // Array com os dias da semana em português
  const diasSemana = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  // Pega o dia da semana atual
  const diaAtual = diasSemana[new Date().getDay()];
  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/nwa logo b.png')} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="pesquisar"
          placeholderTextColor="#fff"
        />
        <Text style={styles.searchIcon}>🔍</Text>
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
      <Text style={styles.sectionTitle}>Vícios • Hoje</Text>
      <View style={styles.addictionCard} />

      {/* Barra de navegação inferior */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomBarItem}>home</Text>
        <Text style={styles.bottomBarItem}>feed</Text>
        <Text style={[styles.bottomBarItem, styles.selectedBarItem]}>☀️</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MoodTransition')}>
          <Text style={styles.bottomBarItem}>tracker</Text>
        </TouchableOpacity>
        <Text style={styles.bottomBarItem}>chat</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e192e',
    paddingTop: 40,
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
  },
  menuLine: {
    width: 22,
    height: 3,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 2,
  },
  logo: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  profileIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a2340',
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    height: 38,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  searchIcon: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 8,
  },
  dayText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quoteCard: {
    backgroundColor: '#23122a',
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
    backgroundColor: '#3a2340',
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
    backgroundColor: '#3a2340',
    borderRadius: 18,
    marginLeft: 8,
    minHeight: 80,
  },
  addictionCard: {
    backgroundColor: '#3a2340',
    borderRadius: 18,
    minHeight: 50,
    marginBottom: 18,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#23122a',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 18,
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
});
