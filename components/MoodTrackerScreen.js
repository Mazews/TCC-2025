import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmojiSelector from './EmojiSelector';
import AppText from './AppText';
import { Feather as Icon } from '@expo/vector-icons';
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
      <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.card }]} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={38} color={theme.textSecondary} />
      </TouchableOpacity>
        <View style={[styles.container, { backgroundColor: 'transparent' }]}> 
          <AppText style={[styles.title, { color: theme.textSecondary }]}>Como está {"\n"}se sentindo hoje?</AppText>
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
           <View style={styles.organicShape2} />
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
    paddingTop: 100,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    color: 'rgba(92, 96, 130, 1)',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  input: {
    width: '75%',
    minHeight: 60,
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderRadius: 18,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: 'rgba(92, 96, 130, 1)',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(92, 96, 130, 1)',
  },
  button: {
    backgroundColor: 'rgba(92, 96, 130, 1)',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 18,
    fontFamily: 'Poppins',
  },
  organicShape1: {
    position: 'absolute',
    bottom: -100,
    left: -120,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(92, 96, 130, 1)',
    borderRadius: 200,
    opacity: 0.5,
    zIndex: 0,
    },
  organicShape2: {
    position: 'absolute',
    bottom: 700,
    left: 200,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(92, 96, 130, 1)',
    borderRadius: 200,
    opacity: 0.5,
    zIndex: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 30,
    shadowColor: 'rgba(92, 96, 130, 0)',
    padding: 8,
    elevation: 4,
  },
  backIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
