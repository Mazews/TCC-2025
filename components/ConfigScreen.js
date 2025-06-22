import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Switch } from 'react-native';

const { width } = Dimensions.get('window');

export default function ConfigScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);
  return (
    <ImageBackground
      source={require('../assets/plainbg.png')}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Configurações</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Modo escuro</Text>
          <Switch
            value={isDark}
            onValueChange={setIsDark}
            thumbColor={isDark ? '#2d304d' : '#fff'}
            trackColor={{ false: '#ccc', true: '#2d304d' }}
          />
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>voltar</Text>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d304d',
    marginBottom: 32,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  switchLabel: {
    fontSize: 20,
    color: '#2d304d',
    fontWeight: '400',
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
    color: '#2d304d',
    fontWeight: '400',
  },
}); 