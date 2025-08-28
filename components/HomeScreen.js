import { useState } from "react";
import {View, StyleSheet,ImageBackground,TextInput,TouchableOpacity,Platform,Image,} from "react-native";
import CircularSlider from "./CircularSlider";
import { useTheme } from "./ThemeContext";
import AppText from "./AppText";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getHomeBg = (theme) =>
  theme.mode === "dark"
    ? require("../assets/bgdark.png")
    : require("../assets/plainbg.png");

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  const diasSemana = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  const dataAtual = new Date();
  const diaSemana = diasSemana[dataAtual.getDay()];
  const dia = String(dataAtual.getDate()).padStart(2, "0");
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
  const ano = dataAtual.getFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;

  const API_BASE_URL = "https://backend-feelflow-core.onrender.com";

  const FetchTOApiVerifyAndSaveUser = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log(token);
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      const dataConvertToJson = JSON.stringify(data[0]);
      await AsyncStorage.setItem("user", dataConvertToJson);
      setUser(await AsyncStorage.getItem("user"));
    } catch (err) {
      console.log(err);
    }
  };
  FetchTOApiVerifyAndSaveUser();

  if (user) {
    const UserConverted = JSON.parse(user);
    return (
      <ImageBackground
        source={getHomeBg(theme)}
        style={[styles.bg, { backgroundColor: theme.background }]}
        imageStyle={styles.bgImage}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: "transparent" }]}>
          <View style={styles.headerLeft}>
            <AppText style={[styles.greeting, { color: theme.text }]}>
              Olá, {UserConverted.name.split(" ")[0]} :)
            </AppText>

            <AppText style={[styles.dateText, { color: theme.textSecondary }]}>
              hoje é {diaSemana}, {dataFormatada}
            </AppText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconCircle}>
              <Image
                source={{ uri: UserConverted.avatar.url }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 75,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.floatingCard, { backgroundColor: theme.card }]}>
          <Icon
            name="search"
            size={20}
            color="#fff"
            style={{ marginRight: 8, opacity: 0.7 }}
          />
          <TextInput
            placeholder="Pesquisar..."
            placeholderTextColor="#fff"
            style={styles.searchInput}
          />
        </View>

        {/* Card de destaque do dia */}
        <View
          style={[
            styles.floatingCard,
            styles.featuredCard,
            { backgroundColor: theme.card },
            
          ]}
        >
          <View style={{ flex: 1 }}>
            <AppText style={styles.featuredTitle}>Frase do Dia</AppText>
            <AppText style={styles.featuredDesc}>
              Descubra algo novo e interessante
            </AppText>
            <TouchableOpacity
            style={styles.exploreBtn}
               onPress={() => navigation.navigate("Quote")}
>
              <AppText style={styles.exploreText}>Acessar</AppText>
            </TouchableOpacity>
            </View>
          
          <View style={styles.featuredIconBox}>
            <Icon name="star" size={28} color="#fff" />
          </View>
        </View>

        {/* CircularSlider  estilizado */}
        <View style={styles.sliderContainer}>
          <CircularSlider
            style={styles.slider}
            onPress={async (key) => {
              switch (key) {
                case "Profile":
                  navigation.navigate("Profile");
                  break;
                case "Tasks":
                  navigation.navigate("Tasks");
                  break;
                case "Activity":
                  navigation.navigate("Activity");
                  break;
                case "Dashboard":
                  navigation.navigate("Dashboard");
                  break;
                case "MoodTracker":
                  navigation.navigate("MoodTracker");
                  break;
                case "Config":
                  navigation.navigate("Config");
                  break;
                case "Guide":
                  navigation.navigate("Guide");
                  break;
                case "Support":
                  navigation.navigate("Help");
                  break;
                case "Terms":
                  navigation.navigate("Terms");
                  break;
                case "Logout":
                  await AsyncStorage.removeItem("userToken");
                  navigation.replace("SignIn");
                  break;
                default:
                  break;
              }
            }}
          />
        </View>
        {/* Atividades Recentes */}
        <View style={styles.activitiesSection}>
          <AppText style={styles.activitiesTitle}>Atividades Recentes</AppText>
          <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
            <View style={styles.activityIconA}>
              <AppText style={styles.activityIconText}>A</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={styles.activityTitle}>Atividade Recente</AppText>
              <AppText style={styles.activityTime}>Há 2 horas</AppText>
            </View>
            <View style={styles.activityStatusA} />
          </View>
          <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
            <View style={styles.activityIconB}>
              <AppText style={styles.activityIconText}>B</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={styles.activityTitle}>Outra Atividade</AppText>
              <AppText style={styles.activityTime}>Ontem</AppText>
            </View>
            <View style={styles.activityStatusB} />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  bgImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 60,
    marginBottom: 18,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    display: "flex",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  greeting: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: "400",
    marginBottom: 4,
    color: "#fff",
    fontFamily: "Poppins",
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Poppins",
    opacity: 0.85,
    marginBottom: 0,
  },
  floatingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.20)",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 30,
    marginBottom: 18,
    shadowColor: "rgba(255, 255, 255, 0)",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins",
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
  },
  featuredCard: {
    backgroundColor: "rgba(255,255,255,0.25)",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "Poppins",
  },
  featuredDesc: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  exploreBtn: {
    backgroundColor: "rgba(255,255,255,0.20)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  exploreText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 15,
    fontFamily: "Poppins",
  },
  featuredIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 18,
  },
  sliderContainer: {
    marginTop: -50,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  menuTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: "Poppins",
  },
  activitiesSection: {
    marginTop: -30,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  activitiesTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#ffffff42",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIconA: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(52, 199, 89, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  activityIconB: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(52, 120, 246, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  activityIconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Poppins",
  },
  activityTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins",
  },
  activityTime: {
    color: "#fff",
    opacity: 0.7,
    fontSize: 13,
    fontFamily: "Poppins",
  },
  activityStatusA: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(52, 199, 89, 0.38)",
    marginLeft: 10,
  },
  activityStatusB: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(52, 120, 246, 0.38)",
    marginLeft: 10,
  },
});
