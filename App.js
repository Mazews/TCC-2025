import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // atualizado
import OnboardingScreen from './components/OnboardingScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import MoodTrackerScreen from './components/MoodTrackerScreen';
import DashboardScreen from './components/DashboardScreen';
import HelpScreen from './components/HelpScreen';
import GuideScreen from './components/GuideScreen';
import ProfileScreen from './components/ProfileScreen';
import TasksScreen from './components/TasksScreen';
import QuoteScreen from './components/QuoteScreen';
import ConfigScreen from './components/ConfigScreen';
import ScheduleScreen from './components/ScheduleScreen';
import SignInScreen from './components/SignInScreen';
import EditProfileScreen from './components/EditProfileScreen';
import { ThemeProvider } from './components/ThemeContext';
import { safeError } from './components/log';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fontFiles } from './config/fonts';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    // prevent the splash screen from auto-hiding while we load resources
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setInitialRoute(token ? 'Onboarding' : 'SignIn');
    };
    checkLogin();
  }, []);

  // Load fonts once on mount
  useEffect(() => {
    let mounted = true;
    async function loadFonts() {
      try {
        await Font.loadAsync(fontFiles);
        if (mounted) setFontsLoaded(true);
      } catch (e) {
        safeError('FontLoad', e);
      } finally {
        SplashScreen.hideAsync().catch(() => {});
      }
    }
    loadFonts();
    return () => {
      mounted = false;
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="Guide" component={GuideScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="Quote" component={QuoteScreen} />
          <Stack.Screen name="Config" component={ConfigScreen} />
          {/* Terms screen removed */}
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Schedule" component={ScheduleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
