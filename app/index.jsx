import {
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
import { usePlayer } from "../context/PlayerContext";

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

  const {
    currentTrack,
    isPlaying,
    isLiked,
    isShuffle,
    repeatMode,
    progress,
    volume,
    playerOpen,
    queue,
    queueIndex,
    // Aktionen
    play,
    pause,
    stop,
    setPlaybackSpeed,
    setPlayerRepeatMode,
    setShuffleEnabled,
    setMediaItems,
    addMediaItems,
    removeMediaItem,
    clear,
    moveMediaItem,
    updateMetaData,
    skipNext,
    skipPrevious,
    seekTo,
    setVolume,
    setIsLiked,
    setIsShuffle,
    openPlayer,
    closePlayer,
  } = usePlayer();

  const playlists = [
    {
      id: 1,
      name: "Chill Vibes",
      artists: [{ name: "Artist 1" }, { name: "Artist 2" }],
    },
    {
      id: 2,
      name: "Workout Mix",
      artists: [{ name: "Artist 3" }, { name: "Artist 4" }],
    },
    {
      id: 3,
      name: "Top Hits",
      artists: [{ name: "Artist 5" }, { name: "Artist 6" }],
    },
    {
      id: 4,
      name: "Indie Gems",
      artists: [{ name: "Artist 7" }, { name: "Artist 8" }],
    },
    {
      id: 5,
      name: "Classical Essentials",
      artists: [{ name: "Artist 9" }, { name: "Artist 10" }],
    },
  ];

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

  const startSong = async () => {
    await setMediaItems([
      {
        id: 1,
        title: "Song 1",
        artist: "Artist 1",
        url: require("../assets/audio/Song1.mp3"),
      },
    ]);
    // play();
  };

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
                  marginTop: 10,
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
                style={{
                  width: "100vw",
                  marginHorizontal: -24,
                  paddingHorizontal: 24,
                  paddingRight: 10,
                }}
              >
                <PlaylistCard key={1} onPress={startSong} />
                <PlaylistCard key={2} />
                <PlaylistCard key={3} />
              </ScrollView>
            </ThemedView>

            {/* Aktuelle Playlist */}
            <ThemedView style={[{ marginTop: 30, marginBottom: 100 }]}>
              <MutedText>Aktuelle Playlist</MutedText>
              {/* <ScrollView> */}
              {playlists.map((playlist, index) => (
                <PlaylistList key={index} playlist={playlist} />
              ))}
              {/* </ScrollView> */}
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
