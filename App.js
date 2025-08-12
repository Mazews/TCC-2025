import React, { useCallback, useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './components/OnboardingScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import MoodTrackerScreen from './components/MoodTrackerScreen';
import DashboardScreen from './components/DashboardScreen';
import TipsScreen from './components/TipsScreen';
import HelpScreen from './components/HelpScreen';
import GuideScreen from './components/GuideScreen';
import ProfileScreen from './components/ProfileScreen';
import TasksScreen from './components/TasksScreen';
import QuoteScreen from './components/QuoteScreen';
import ConfigScreen from './components/ConfigScreen';
import TermsScreen from './components/TermsScreen';
import SignInScreen from './components/SignInScreen';
import RegisterScreen from './components/RegisterScreen';
import EditProfileScreen from './components/EditProfileScreen';
import { ThemeProvider } from './components/ThemeContext';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={() =>
          Font.loadAsync({
            'Poppins': require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
            'Poppins-Bold': require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
            // adicione outras variações se quiser
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
        <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Tips" component={TipsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="Guide" component={GuideScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="Activity" component={QuoteScreen} />
          <Stack.Screen name="Config" component={ConfigScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
