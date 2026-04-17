import {
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Colors } from "../constants/Colors";
import ThemedView from "../components/ThemedView";
import TopBar from "../components/TopBar";
import MutedText from "../components/MutedText";

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
import ThemedText from "../components/ThemedText";
import PlaylistCard from "../components/PlaylistCard";

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

  return (
    // App
    <SafeAreaProvider
      style={{ backgroundColor: theme.BG, fontFamily: FONTS.body }}
    >
      <SafeAreaView>
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
            >
              <PlaylistCard style={{ marginTop: 14 }} />
              <PlaylistCard style={{ marginTop: 14 }} />
              <PlaylistCard style={{ marginTop: 14 }} />
            </ScrollView>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({});
