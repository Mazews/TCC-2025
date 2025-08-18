import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import AppText from './AppText';
import { useTheme } from './ThemeContext';

const { width, height } = Dimensions.get('window');

export default function TasksScreen({ navigation }) {
  const { theme } = useTheme();
  const tasks = [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ImageBackground
        source={require('../assets/plainbg.png')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
          <AppText style={[styles.title, { color: theme.text }]}>Tarefas</AppText>
          {tasks.length === 0 ? (
            <AppText style={[styles.emptyText, { color: theme.textSecondary }]}>Sem tarefas por hoje, descanse :)</AppText>
          ) : (
            tasks.map((task, idx) => (
              <View key={idx} style={[styles.taskBox, { backgroundColor: theme.card }]}>
                <AppText style={[styles.taskText, { color: theme.text }]}>{task}</AppText>
              </View>
            ))
          )}
          <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.button }]} onPress={() => navigation.goBack()}>
            <AppText style={[styles.backButtonText, { color: theme.buttonText }]}>voltar</AppText>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width > 500 ? 380 : width * 0.85,
    borderRadius: 36,
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    maxWidth: 400,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
  },
  taskBox: {
    width: '100%',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  taskText: {
    fontSize: 18,
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