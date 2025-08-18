import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmojiSelector from './EmojiSelector';
import AppText from './AppText';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from './ThemeContext';


export default function MoodTrackerScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [text, setText] = useState('');
  const { theme } = useContext(ThemeContext);

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
    <ImageBackground
      source={theme.registroImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1 }}>
      <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.backButton }]} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={38} color={theme.text} />
      </TouchableOpacity>
        <View style={[styles.container, { backgroundColor: 'transparent' }]}> 
          <AppText style={[styles.title, { color: theme.text }]}>Como está se sentindo hoje?</AppText>
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
            <AppText style={styles.buttonText}>Enviar</AppText>
          </TouchableOpacity>
          <View style={styles.organicShape1} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: 60,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    color: '#5c6082',
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
    color: '#5c6082',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#5c6082',
  },
  button: {
    backgroundColor: '#5c6082',
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
    backgroundColor: '#5c6082',
    borderRadius: 200,
    opacity: 0.08,
    zIndex: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
    padding: 8,
    elevation: 4,
  },
  backIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
