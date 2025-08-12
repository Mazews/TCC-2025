import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler } from 'react-native-reanimated';
import AppText from './AppText';

const { width } = Dimensions.get('window');
const RADIUS = width * 0.70; // reduz o raio para garantir que os botões fiquem visíveis
const BUTTON_SIZE = 100;
const BUTTONS = [
  { key: 'Profile', label: 'perfil', icon: require('../assets/profile.png') },
  { key: 'Tasks', label: 'tarefas', icon: require('../assets/book.png') },
  { key: 'Activity', label: 'quotes', icon: require('../assets/quotes.png') },
  { key: 'Dashboard', label: 'dash', icon: require('../assets/dash.png') },
  { key: 'MoodTracker', label: 'humor', icon: require('../assets/humor.png') },
  { key: 'Config', label: 'config', icon: require('../assets/gear.png') },
  { key: 'Guide', label: 'guia', icon: require('../assets/guide.png') },
  { key: 'Support', label: 'ajuda', icon: require('../assets/warning.png') },
  { key: 'Terms', label: 'termos', icon: require('../assets/book2.png') },
  { key: 'Logout', label: 'sair', icon: require('../assets/logout.png') },
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
                {btn.icon ? (
                  <Image source={btn.icon} style={{ width: 38, height: 38, resizeMode: 'contain' }} />
                ) : (
                  <AppText style={styles.buttonText}>{btn.label}</AppText>
                )}
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
    left: 40, 
    right: 0,
    bottom: 150, 
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
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.5,
    shadowRadius: 10,
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