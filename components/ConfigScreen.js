import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Switch } from 'react-native';
import { useTheme } from './ThemeContext';
import AppText from './AppText';

const { width } = Dimensions.get('window');

export default function ConfigScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme.mode === 'dark');

  useEffect(() => {
    setIsDark(theme.mode === 'dark');
  }, [theme]);

  const handleSwitch = () => {
    toggleTheme();
    setIsDark((prev) => !prev);
  };

  return (
    <ImageBackground
      source={theme.image}
      style={[styles.background]}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}> 
        <AppText style={[styles.title, { color: theme.text }]}>Configurações</AppText>
        <View style={styles.switchRow}>
          <AppText style={[styles.switchLabel, { color: theme.textSecondary }]}>Modo escuro</AppText>
          <Switch
            value={isDark}
            onValueChange={handleSwitch}
            thumbColor={isDark ? theme.switchThumb : theme.switchThumb}
            trackColor={{ false: theme.switchTrack, true: theme.switchTrack }}
          />
        </View>
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
    width: width > 500 ? 380 : width * 0.55,
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
    fontWeight: '400',
  },
  backButton: {
    width: '60%',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: '400',
  },
}); 