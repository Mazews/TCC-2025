import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function TasksScreen({ navigation }) {
  // Simule tarefas, pode ser um array vazio para testar a mensagem
  const tasks = [];
  return (
    <ImageBackground
      source={require('../assets/plainbg.png')}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Tarefas</Text>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>Sem tarefas por hoje, descanse :)</Text>
        ) : (
          tasks.map((task, idx) => (
            <View key={idx} style={styles.taskBox}>
              <Text style={styles.taskText}>{task}</Text>
            </View>
          ))
        )}
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
  emptyText: {
    fontSize: 18,
    color: '#5c6082',
    marginBottom: 32,
    textAlign: 'center',
  },
  taskBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  taskText: {
    fontSize: 18,
    color: '#2d304d',
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