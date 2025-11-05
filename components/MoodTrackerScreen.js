import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Inline emoji selector (merged to avoid includes/null mismatch)
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
import AppText from './AppText';
import { Feather as Icon } from '@expo/vector-icons';
import { ThemeContext } from './ThemeContext';

export default function MoodTrackerScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [text, setText] = useState('');
  const { theme } = useContext(ThemeContext);

  const handleSelect = (label) => {
    setSelected(label);
  };

  const handleSubmit = async () => {
    if (!selected) {
      Alert.alert('Atenção', 'Selecione pelo menos uma emoção!');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        navigation.navigate('Login');
        return;
      }

  const response = await fetch('https://backend-fellsystem.vercel.app/customers/set/mood-diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          emotion: selected,
          intensity: intensity,
          description: text
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Humor registrado com sucesso!');
        setSelected(null);
        setIntensity(5);
        setText('');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', data.error || 'Erro ao registrar humor');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <ImageBackground
      source={theme.registroImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.card }]} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={38} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <View style={[styles.container, { backgroundColor: 'transparent' }]}> 
          <AppText style={[styles.title, { color: theme.textSecondary }]}>
            Como está {"\n"}se sentindo hoje?
          </AppText>
          
          {/* Inline Emoji grid to avoid external dependency and null.includes crash */}
          <View style={styles.grid}>
            {EMOJIS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.emojiButton,
                  selected === item.label && styles.selected,
                ]}
                onPress={() => handleSelect(item.label)}
              >
                <AppText style={styles.emoji}>{item.emoji}</AppText>
              </TouchableOpacity>
            ))}
          </View>
          
          {selected && (
            <View style={styles.intensityContainer}>
              <AppText style={[styles.intensityLabel, { color: theme.textSecondary }]}>
                Intensidade: {intensity}
              </AppText>
              <View style={styles.intensitySlider}>
                {[...Array(11)].map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.intensityButton,
                      intensity === i && styles.intensityButtonSelected
                    ]}
                    onPress={() => setIntensity(i)}
                  >
                    <AppText style={[
                      styles.intensityText,
                      intensity === i && styles.intensityTextSelected
                    ]}>
                      {i}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
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
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 40,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    color: 'rgba(92, 96, 130, 1)',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  intensityContainer: {
    width: '85%',
    marginVertical: 20,
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
  },
  intensitySlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  intensityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderWidth: 2,
    borderColor: 'rgba(92, 96, 130, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityButtonSelected: {
    backgroundColor: 'rgba(92, 96, 130, 1)',
  },
  intensityText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: 'rgba(92, 96, 130, 1)',
  },
  intensityTextSelected: {
    color: 'rgba(255, 255, 255, 1)',
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