import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function MoodTransitionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileIcon}>👤</Text>
        </View>
      </View>
      {/* Main content */}
      <View style={styles.mainContent}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>mood tracker</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>
        </View>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <View style={styles.dividerRow}>
          <View style={styles.dividerDiamond} />
          <View style={styles.dividerLine} />
          <View style={styles.dividerDiamond} />
        </View>
        {/* Botões Dia, Mês, Ano */}
        <View style={styles.periodRow}>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>Dia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>Mes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>Ano</Text>
          </TouchableOpacity>
        </View>
        {/* Diário de Humor */}
        <TouchableOpacity style={styles.diaryButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.diaryText}>DIÁRIO DE HUMOR</Text>
        </TouchableOpacity>
        {/* Ilustração (placeholder) */}
        <View style={styles.illustrationBox}>
          {/* Aqui você pode colocar uma imagem ilustrativa */}
          <Image source={require('../assets/motherhug.png')} style={styles.illustrationLarge} resizeMode="contain" />
        </View>
        {/* Dicas, Guia, Frases */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomText}>Dicas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomText}>Guia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomText}>Frases</Text>
          </TouchableOpacity>
        </View>
        {/* Registre seu humor */}
        <TouchableOpacity style={styles.helpButton} onPress={() => navigation.navigate('MoodTracker')}>
          <Text style={styles.helpText}>REGISTRE SEU HUMOR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  sidebar: {
    width: 60,
    backgroundColor: '#6e7f9c',
    alignItems: 'center',
    paddingTop: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    fontSize: 24,
  },
  mainContent: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitleBox: {
    backgroundColor: '#5c6082',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  menuLine: {
    width: 28,
    height: 4,
    backgroundColor: '#5c6082',
    marginVertical: 2,
    borderRadius: 2,
  },
  dashboardTitle: {
    color: '#5c6082',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dividerDiamond: {
    width: 16,
    height: 16,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#5c6082',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 4,
  },
  dividerLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#5c6082',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#5c6082',
    borderRadius: 24,
    marginHorizontal: 8,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodText: {
    color: '#5c6082',
    fontSize: 20,
    fontWeight: '500',
  },
  diaryButton: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#5c6082',
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  diaryText: {
    color: '#5c6082',
    fontSize: 22,
    fontWeight: 'bold',
  },
  illustrationBox: {
    alignItems: 'center',
    marginBottom: 18,
  },
  illustration: {
    width: 220,
    height: 180,
  },
  illustrationLarge: {
    width: 320,
    height: 260,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#5c6082',
    borderRadius: 24,
    marginHorizontal: 8,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    color: '#5c6082',
    fontSize: 18,
    fontWeight: '500',
  },
  helpButton: {
    backgroundColor: '#5c6082',
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  helpText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
