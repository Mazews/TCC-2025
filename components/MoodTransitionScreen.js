import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function MoodTransitionScreen({ navigation }) {
  const hoje = new Date();
  const dia = hoje.getDate().toString().padStart(2, '0');
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const ano = hoje.getFullYear();
  return (
    <ImageBackground
      source={require('../assets/dashbg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>mood tracker</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <View style={styles.menuIcon}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.periodRow}>
            <TouchableOpacity style={styles.periodButton}>
              <Text style={styles.periodText}>{dia}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.periodButton}>
              <Text style={styles.periodText}>{mes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.periodButton}>
              <Text style={styles.periodText}>{ano}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.diaryButton} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.diaryText}>DIÁRIO DE HUMOR</Text>
          </TouchableOpacity>
          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Tips')}>
              <Text style={styles.bottomText}>Dicas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Guide')}>
              <Text style={styles.bottomText}>Guia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Help')}>
              <Text style={styles.bottomText}>Ajuda</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.helpButton} onPress={() => navigation.navigate('MoodTracker')}>
            <Text style={styles.helpText}>REGISTRE SEU HUMOR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContent: {
    flex: 1,
    padding: 24,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  headerTitleBox: {
    backgroundColor: '#5c6082',
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 20,
    right: -70,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    marginTop: 20,
  },
  menuLine: {
    width: 22,
    height: 3,
    backgroundColor: '#5c6082',
    marginVertical: 2,
    borderRadius: 2,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 10,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#5c6082',
    borderRadius: 24,
    marginHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20
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
    marginBottom: 40,
    marginTop: 10,
  },
  diaryText: {
    color: '#5c6082',
    fontSize: 22,
    fontWeight: 'bold',
  },
  illustrationLarge: {
    width: 320,
    height: 260,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 300,
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
    marginTop: 10,
  },
  helpText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
