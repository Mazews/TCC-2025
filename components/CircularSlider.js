import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const RADIUS = width * 1; // aumenta o raio para espaçar mais os botões
const BUTTON_SIZE = 100;
const BUTTONS = [
  { key: 'Profile', label: 'perfil' },
  { key: 'Tasks', label: 'tarefas' },
  { key: 'Activity', label: 'atividade' },
  { key: 'Dashboard', label: 'dash' }, // novo botão
  { key: 'MoodTracker', label: 'humor' },   // novo botão
  { key: 'Config', label: 'config' },
  { key: 'Guide', label: 'guia' },
  { key: 'Support', label: 'ajuda' },
  { key: 'Terms', label: 'termos' },
  { key: 'Logout', label: 'sair' },
];

export default function CircularSlider({ onPress }) {
  const rotation = useSharedValue(0);
  const angleStep = Math.PI / (BUTTONS.length - 1); // já usa o número de botões

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx) => {
      rotation.value = ctx.startRotation + event.translationX / 120;
    },
    onEnd: () => {
      rotation.value = withSpring(rotation.value, { damping: 15 });
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={styles.container} pointerEvents="box-none">
        {BUTTONS.map((btn, idx) => {
          // Cada botão recebe um estilo animado para rotacionar junto com o slider
          const animatedStyle = useAnimatedStyle(() => {
            const angle = Math.PI + idx * angleStep + rotation.value;
            const x = RADIUS * Math.cos(angle);
            const y = RADIUS * Math.sin(angle);
            return {
              left: width / 2 + x - BUTTON_SIZE / 2,
              bottom: 20 + y, // mantém o espaçamento vertical dos botões
              position: 'absolute',
            };
          });
          return (
            <Animated.View
              key={btn.key}
              style={[styles.buttonWrapper, animatedStyle]}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => onPress(btn.key)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{btn.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        <View style={[styles.centerCircle, { bottom: -50 + RADIUS - 38 }]}>
          <Text style={styles.centerIcon}>🔍</Text>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -220, // move o slider mais para baixo
    height: width * 0.6,
    justifyContent: 'flex-end',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#5c6082',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerCircle: {
    position: 'absolute',
    left: width / 2 - 38,
    bottom: 40 + RADIUS - 38,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  centerIcon: {
    fontSize: 36,
    color: '#5c6082',
  },
}); 