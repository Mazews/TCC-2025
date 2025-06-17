import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmojiSelector from './EmojiSelector';

export default function MoodTrackerScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [text, setText] = useState('');

  const handleSelect = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      Alert.alert('Selecione pelo menos uma emoção!');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const entry = { date: today, moods: selected, note: text };
    let data = await AsyncStorage.getItem('moodData');
    data = data ? JSON.parse(data) : [];
    data.push(entry);
    await AsyncStorage.setItem('moodData', JSON.stringify(data));
    setSelected([]);
    setText('');
    Alert.alert('Humor registrado!');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como está se sentindo hoje?</Text>
      <EmojiSelector selected={selected} onSelect={handleSelect} />
      <TextInput
        style={styles.input}
        placeholder="O que te fez sentir assim?"
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
      <View style={styles.organicShape1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    color: '#2e192e',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '85%',
    minHeight: 60,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    padding: 14,
    fontSize: 16,
    color: '#2e192e',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2e192e',
  },
  button: {
    backgroundColor: '#2e192e',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  organicShape1: {
    position: 'absolute',
    bottom: -100,
    left: -120,
    width: 300,
    height: 300,
    backgroundColor: '#2e192e',
    borderRadius: 200,
    opacity: 0.08,
    zIndex: 0,
  },
});
