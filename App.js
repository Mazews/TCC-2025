import React, { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
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
import TermsScreen from './components/TermsScreen';
import SignInScreen from './components/SignInScreen';
import EditProfileScreen from './components/EditProfileScreen';
import { ThemeProvider } from './components/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setInitialRoute(token ? 'Home' : 'SignIn');
    };
    checkLogin();
  }, []);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={() =>
          Font.loadAsync({
            'Poppins': require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
            'Poppins-Bold': require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
          })
        }
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

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
          <Stack.Screen name="Activity" component={QuoteScreen} />
          <Stack.Screen name="Config" component={ConfigScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
