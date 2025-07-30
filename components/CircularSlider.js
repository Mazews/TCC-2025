import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const RADIUS = width * 0.70; // reduz o raio para garantir que os botões fiquem visíveis
const BUTTON_SIZE = 100;
const BUTTONS = [
  { key: 'Profile', label: 'perfil' },
  { key: 'Tasks', label: 'tarefas' },
  { key: 'Activity', label: 'quotes' },
  { key: 'Dashboard', label: 'dash' }, // novo botão
  { key: 'MoodTracker', label: 'humor' },   // novo botão
  { key: 'Config', label: 'config' },
  { key: 'Guide', label: 'guia' },
  { key: 'Support', label: 'ajuda' },
  { key: 'Terms', label: 'termos' },
  { key: 'Logout', label: 'sair' },
];

export default function CircularSlider({ onPress }) {
  // Encontrar o índice do botão 'humor'
  const centerIndex = BUTTONS.findIndex(btn => btn.key === 'MoodTracker');
  const angleStep = 2 * Math.PI / BUTTONS.length; // círculo completo
  const initialRotation = -centerIndex * angleStep;
  // Limites: centralizar o primeiro e o último botão
  const minRotation = -((BUTTONS.length - 1) * angleStep);
  const maxRotation = 0;

  const rotation = useSharedValue(initialRotation);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx) => {
      let next = ctx.startRotation + event.translationX / 120;
      // Limita o valor de rotação para não sumir botões
      next = Math.max(minRotation, Math.min(maxRotation, next));
      rotation.value = next;
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
            const angle = Math.PI / 2 + idx * angleStep + rotation.value; // começa do topo
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
        <View style={[styles.centerCircle, { bottom: -100 + RADIUS - 40 }]}>
          <Image source={require('../assets/logo.png')} style={styles.centerLogo} resizeMode="contain" />
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
    bottom: -80, 
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
    fontFamily: 'Poppins',

    textAlign: 'center',
  },
  centerCircle: {
    position: 'absolute',
    left: width / 2 - 38,
    bottom: 180, 
    width: 76,
    height: 76,
    borderRadius: 40,
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
  centerLogo: {
    width: 48,
    height: 48,
  },
}); 