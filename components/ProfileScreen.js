import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import AppText from "./AppText";
import { ThemeContext } from "./ThemeContext";
import { getProfile } from "./api";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  const profile = {
    nome: "José Maria",
    sobrenome: "Silva",
    email: "jose@email.com",
    username: "josemaria",
    dataEntrada: "01/01/2024",
    profilePic: require("../assets/profile.png"),
  };

  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const p = await getProfile();
        if (p) setRemote(p);
      } catch (e) {
        // ignore, will use fallback
      } finally {
        setLoading(false);
      }
      setUser(JSON.parse(await AsyncStorage.getItem("user")));
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Tem certeza que deseja sair?",
      "",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
        },
      ],
      { cancelable: true }
    );
  };

  if (user) {
  // safeLog not required here; removed stray log
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ImageBackground
          source={
            theme.mode === "dark"
              ? require("../assets/bgdark2.png")
              : require("../assets/loginbg.png")
          }
          style={[styles.background, { backgroundColor: theme.background }]}
          imageStyle={{ resizeMode: "cover" }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.profileHeader}>
                <Image source={{ uri: user.avatar.url }}
         style={styles.profileIcon} />
                <View style={styles.profileInfo}>
                  <AppText style={[styles.profileName, { color: theme.text }]}>
                    {user.name}
                  </AppText>
                  <AppText style={[styles.profileDate, { color: theme.text }]}>
                    {new Date(user.createdAt).toLocaleDateString("pt-br")}
                  </AppText>
                  <AppText style={[styles.profileEmail, { color: theme.text }]}>
                    {user.email}
                  </AppText>
                  {user.nickname ? (
                    <AppText
                      style={[styles.profileUsername, { color: theme.text }]}
                    >
                      {remote?.username || profile.username}
                    </AppText>
                  ) : null}
                </View>
              </View>
              <View style={styles.buttonList}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.card }]}
                  onPress={() =>
                    navigation.navigate("EditProfileScreen", {
                      profile: remote,
                    })
                  }
                >
                  <AppText style={[styles.buttonText, { color: theme.text }]}>
                    editar perfil
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.card }]}
                  onPress={() => navigation.navigate("Config")}
                >
                  <AppText style={[styles.buttonText, { color: theme.text }]}>
                    configurações
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.card }]}
                  onPress={handleLogout}
                >
                  <AppText style={[styles.buttonText, { color: theme.text }]}>
                    logout
                  </AppText>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.backButton, { backgroundColor: theme.card }]}
                onPress={() => navigation.goBack()}
              >
                <AppText style={[styles.backButtonText, { color: theme.text }]}>
                  voltar
                </AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    width: width * 0.9,
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    width: "100%",
  },
  profileIcon: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 3,
    borderColor: "#2d304d",
    resizeMode: "contain",
    marginRight: 18,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 22, fontFamily: "Poppins-Bold" },
  profileDate: { fontSize: 14, marginTop: 2, fontFamily: "Poppins" },
  profileEmail: { fontSize: 14, marginTop: 2, fontFamily: "Poppins" },
  profileUsername: { fontSize: 13, marginTop: 2, fontFamily: "Poppins" },
  buttonList: { width: "100%", alignItems: "center", marginBottom: 20 },
  button: {
    width: "100%",
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 12,
    paddingLeft: 20,
  },
  buttonText: {
    fontFamily: "Poppins",
    fontSize: 16,
  },

  backButton: {
    width: "60%",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  backButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
});