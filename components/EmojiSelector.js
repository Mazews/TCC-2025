import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from './AppText';

// Safe emoji selector: checks selected as a string (not calling includes on null)
const EMOJIS = [
  { label: 'Feliz', emoji: '😊' },
  { label: 'Muito feliz', emoji: '😁' },
  { label: 'Triste', emoji: '😢' },
  { label: 'Muito triste', emoji: '😭' },
  { label: 'Indiferente', emoji: '😐' },
  { label: 'Com raiva', emoji: '😠' },
  { label: 'Furioso', emoji: '😡' },
  { label: 'Ansioso', emoji: '😰' },
  { label: 'Envergonhado', emoji: '😳' },
  { label: 'Péssimo', emoji: '💩' },
  { label: 'Cansado', emoji: '😩' },
  { label: 'Animado', emoji: '🔥' },
];

export default function EmojiSelector({ selected = null, onSelect = () => {} }) {
  return (
    <View style={styles.grid}>
      {EMOJIS.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.emojiButton, selected === item.label && styles.selected]}
          onPress={() => onSelect(item.label)}
        >
          <AppText style={styles.emoji}>{item.emoji}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 30,
  },
  emojiButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5c6082',
  },
  selected: {
    backgroundColor: '#5c6082',
  },
  emoji: {
    fontSize: 30,
  },
});
