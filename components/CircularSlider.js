import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AppText from './AppText';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from './ThemeContext';
import {wp,RF, hp } from './responsive'; 

const { width } = Dimensions.get('window');

// Tamanho do botão proporcional à tela
const BUTTON_SIZE = wp(23);  
const ICON_SIZE = BUTTON_SIZE * 0.3; 

const BUTTONS = [
  { key: 'Profile', label: 'perfil', icon: 'user' },
  { key: 'Tasks', label: 'tarefas', icon: 'book' },
  { key: 'Activity', label: 'quotes', icon: 'message-circle' },
  { key: 'Dashboard', label: 'dash', icon: 'bar-chart-2' },
  { key: 'MoodTracker', label: 'humor', icon: 'smile' },
  { key: 'Config', label: 'config', icon: 'settings' },
  { key: 'Guide', label: 'guia', icon: 'compass' },
  { key: 'Support', label: 'ajuda', icon: 'help-circle' },
  { key: 'Terms', label: 'termos', icon: 'file-text' },
  { key: 'Logout', label: 'sair', icon: 'log-out' },
];

export default function CircularSlider({ onPress }) {
  const { theme } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {BUTTONS.map((btn) => (
        <View key={btn.key} style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.card }]}
            onPress={() => onPress(btn.key)}
            activeOpacity={0.8}
          >
            <Icon name={btn.icon} size={ICON_SIZE} color={theme.text} />
            <AppText style={[styles.buttonLabel, { color: theme.text }]}>{btn.label}</AppText>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0),
    paddingHorizontal: wp(4),
    gap: 10,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 3, 
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  buttonLabel: {
    fontSize: RF(14),
    fontFamily: 'Poppins',
    marginTop: hp(0.5),
    textAlign: 'center',
  },
});
