import {
  StyleSheet,
  useColorScheme,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Colors } from "../constants/Colors";
import ThemedView from "../components/ThemedView";
import TopBar from "../components/TopBar";
import MutedText from "../components/MutedText";
import MiniPlayer from "../components/MiniPlayer";

// Fonts
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from "@expo-google-fonts/dm-serif-display";
import {
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { FONTS } from "../assets/fonts/fonts";
import SelectorTag from "../components/SelectorTag";
import PlaylistCard from "../components/PlaylistCard";
import PlaylistList from "../components/PlaylistList";

const Home = () => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    DMSerifDisplay: DMSerifDisplay_400Regular,
    DMSans: DMSans_400Regular,
    DMSansBold: DMSans_700Bold,
    DMSerifDisplay_400Regular_Italic: DMSerifDisplay_400Regular_Italic,
  });

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [selected, setSelected] = useState("Alles");

  if (!fontsLoaded) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.BG,
        }}
      >
        <ActivityIndicator size="large" color={theme.ACCENT} />
        <Text style={{ marginTop: 12, color: theme.TEXT, fontSize: 16 }}>
          Schriftarten werden geladen...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    // App
    <SafeAreaProvider
      style={{ backgroundColor: theme.BG, fontFamily: FONTS.body }}
    >
      <SafeAreaView>
        <ScrollView>
          <ThemedView style={{ marginLeft: 24, marginRight: 24 }}>
            {/* Topbar */}
            <TopBar />

            {/* Music / Podcast selector */}
            <ThemedView
              style={[
                {
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  flexWrap: "wrap",
                },
              ]}
            >
              <SelectorTag
                isActive={selected === "Alles"}
                onPress={() => setSelected("Alles")}
              >
                Alles
              </SelectorTag>
              <SelectorTag
                isActive={selected === "Musik"}
                onPress={() => setSelected("Musik")}
              >
                Musik
              </SelectorTag>
              <SelectorTag
                isActive={selected === "Podcast"}
                onPress={() => setSelected("Podcast")}
              >
                Podcast
              </SelectorTag>
            </ThemedView>

            {/* Zuletzt gehört */}
            <ThemedView style={[{ marginTop: 30 }]}>
              <MutedText>Zuletzt gehört</MutedText>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: -10 }}
              >
                <PlaylistCard style={{ marginTop: 14 }} />
                <PlaylistCard style={{ marginTop: 14 }} />
                <PlaylistCard style={{ marginTop: 14 }} />
              </ScrollView>
            </ThemedView>

            {/* Aktuelle Playlist */}
            <ThemedView style={[{ marginTop: 30 }]}>
              <MutedText>Aktuelle Playlist</MutedText>
              <ScrollView>
                <PlaylistList style={{ marginTop: 10 }} isPlaying={false} />
                <PlaylistList style={{ marginTop: 10 }} isPlaying={true} />
                <PlaylistList style={{ marginTop: 10 }} isPlaying={false} />
                <PlaylistList style={{ marginTop: 10 }} isPlaying={false} />
                <PlaylistList style={{ marginTop: 10 }} isPlaying={false} />
              </ScrollView>
            </ThemedView>
          </ThemedView>
        </ScrollView>
        {/* Player */}
        <MiniPlayer
          style={{
            position: "absolute",
            bottom: 0, // ← direkt über NavBar (ggf. anpassen)
            left: 0,
            right: 0,
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
