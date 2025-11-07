import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import AppText from "./AppText";
import { useTheme } from "./ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const getSignInBg = (theme) =>
  theme.mode === "dark"
    ? require("../assets/bgdark2.png")
    : require("../assets/loginbg.png");

export default function SignInScreen({ navigation }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    Platform.OS === "android"
  ? "https://backend-fellsystem.vercel.app"
  : "https://backend-fellsystem.vercel.app";

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      
      const endpoints = [
        `${API_BASE_URL}/custumers/login`,
        `${API_BASE_URL}/customers/login`,
        `${API_BASE_URL}/auth/login`,
        `${API_BASE_URL}/login`,
      ];
      let response = null;
      for (const ep of endpoints) {
        try {
          response = await fetch(ep, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              email: email.trim().toLowerCase(),
              password: senha,
              mobile: true,
            }),
          });
          // if we got any response (even 4xx/5xx) stop trying others
          if (response) break;
        } catch (e) {
          // try next endpoint
        }
      }

      if (!response) throw new Error('Nenhuma resposta do servidor');

      console.log('Status da resposta:', response.status);

      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        console.warn('Resposta não é JSON:', text?.slice(0, 200));
        throw new Error('Resposta inválida do servidor');
      }

      console.log('Resposta completa da API:', data);

      if (!response.ok) {
        throw new Error(data?.msg || `Erro na autenticação (HTTP ${response.status})`);
      }

      const token = data?.token || data?.accessToken || data?.data?.token;
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        navigation.replace('Home');
      } else if (data?.msg && data.msg.includes('sucesso')) {
        await AsyncStorage.setItem('userToken', email);
        navigation.replace('Home');
      } else {
        Alert.alert('Erro', data?.msg || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      Alert.alert('Erro', error.message || 'Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={getSignInBg(theme)}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.topContent}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <AppText style={styles.title}>Bem vindo (a) de{"\n"}volta!</AppText>
      </View>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          editable={!loading}
        />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.8 }]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <AppText style={styles.buttonText}>voltar</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonPrimary, loading && { opacity: 0.8 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <AppText style={styles.buttonText}>avançar</AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topContent: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 30,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 15,
    marginTop: 100,
    resizeMode: "contain",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  card: {
    width: width > 500 ? 400 : width * 0.75,
    backgroundColor: "rgba(255,255,255,0.32)",
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: -10,
  marginBottom: 30,
  },
  input: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 32,
    padding: 16,
    marginBottom: 18,
    fontSize: 18,
    color: "#7a8ca4",
    fontFamily: "Poppins-Regular",
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPrimary: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    textTransform: "lowercase",
    fontFamily: "Poppins-Bold",
  },
});
