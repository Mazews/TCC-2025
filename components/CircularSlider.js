import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AppText from './AppText';
import Icon from 'react-native-vector-icons/Feather';

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
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {BUTTONS.map((btn) => (
        <View key={btn.key} style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPress(btn.key)}
            activeOpacity={0.8}
          >
            <Icon name={btn.icon} size={32} color="#fff" />
            <AppText style={styles.buttonLabel}>{btn.label}</AppText>
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    gap: 20,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    shadowColor: '#ffffff42',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#5c6082',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginTop: 6,
  },
  buttonLabel: {
    color: '#ffffffff',
    fontSize: 13,
    fontFamily: 'Poppins',
    marginTop: 4,
    textAlign: 'center',
  },
});