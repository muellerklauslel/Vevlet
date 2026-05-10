import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { StatusBar } from "expo-status-bar";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FONTS } from "../assets/fonts/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as Svg from "react-native-svg";
import MiniPlayer from "../components/MiniPlayer";
import { PlayerProvider } from "../context/PlayerContext";
import PlayerScreen from "../components/PlayerScreen";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.BG }}>
        <StatusBar value="auto" />
        <PlayerProvider>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: theme.BG,
                borderTopColor: theme.MUTED || "#ccc",
                height: 60,
              },
              tabBarActiveTintColor: theme.ACCENT || "#000",
              tabBarInactiveTintColor: theme.DIM || "#666",
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="search"
              options={{
                title: "Suchen",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="search" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="library"
              options={{
                title: "Bibliothek",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="library" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profil",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" color={color} size={size} />
                ),
              }}
            />
          </Tabs>
          <MiniPlayer style={{ bottom: 95 }} /> <PlayerScreen />
        </PlayerProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RootLayout;
