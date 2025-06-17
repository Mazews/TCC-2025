import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

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

export default function EmojiSelector({ selected, onSelect }) {
  return (
    <View style={styles.grid}>
      {EMOJIS.map((item, idx) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.emojiButton,
            selected.includes(item.label) && styles.selected,
          ]}
          onPress={() => onSelect(item.label)}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
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
  },
  emojiButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2e192e',
  },
  selected: {
    backgroundColor: '#2e192e',
  },
  emoji: {
    fontSize: 30,
  },
});
