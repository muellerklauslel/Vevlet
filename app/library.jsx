import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import LibrarySelector from "../components/LibrarySelector";
import PlaylistList from "../components/PlaylistList";
import AlbumList from "../components/AlbumList";
import ArtistList from "../components/ArtistList";
import { Ionicons } from "@expo/vector-icons";

const Library = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [activeTab, setActiveTab] = useState("Playlist");

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

  const albums = [
    {
      id: 1,
      name: "Album 1",
      artists: [{ name: "Artist A" }, { name: "Artist B" }],
    },
    {
      id: 2,
      name: "Album 2",
      artists: [{ name: "Artist C" }, { name: "Artist D" }],
    },
    {
      id: 3,
      name: "Album 3",
      artists: [{ name: "Artist E" }, { name: "Artist F" }],
    },
    {
      id: 4,
      name: "Album 4",
      artists: [{ name: "Artist G" }, { name: "Artist H" }],
    },
  ];

  const artist = [
    {
      id: 1,
      name: "Artist 1",
    },
    {
      id: 2,
      name: "Artist 2",
    },
    {
      id: 3,
      name: "Artist 3",
    },
    {
      id: 4,
      name: "Artist 4",
    },
  ];

  const add = () => {
    console.log("Add-Button gedrückt");
  };

  return (
    <SafeAreaProvider
      style={{ backgroundColor: theme.BG, fontFamily: FONTS.body }}
    >
      <SafeAreaView>
        <ScrollView style={{ height: "100%" }}>
          <ThemedView style={{ marginLeft: 24, marginRight: 24 }}>
            <ThemedView
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ThemedText
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 32,
                  color: theme.ACCENT,
                }}
              >
                Bibliothek
              </ThemedText>
              <Pressable onPress={add}>
                <Ionicons name="add-circle" size={36} color={theme.ACCENT} />
              </Pressable>
            </ThemedView>

            {/* Playlist / Album / Artist Selector */}
            <ThemedView
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: theme.SURFACE2,
                marginTop: 16,
                padding: 5,
                borderRadius: 12,
              }}
            >
              <LibrarySelector
                isActive={activeTab === "Playlist"}
                onPress={() => setActiveTab("Playlist")}
              >
                Playlist
              </LibrarySelector>
              <LibrarySelector
                isActive={activeTab === "Album"}
                onPress={() => setActiveTab("Album")}
              >
                Album
              </LibrarySelector>
              <LibrarySelector
                isActive={activeTab === "Artist"}
                onPress={() => setActiveTab("Artist")}
              >
                Artist
              </LibrarySelector>
            </ThemedView>

            {/* Content for the selected tab */}
            {activeTab === "Playlist" ? (
              <ThemedView style={{ marginTop: 24 }}>
                {playlists.map((playlist, index) => (
                  <PlaylistList key={index} playlist={playlist} />
                ))}
              </ThemedView>
            ) : null}
            {activeTab === "Album" ? (
              <ThemedView style={{ marginTop: 24 }}>
                {albums.map((album, index) => (
                  <AlbumList key={index} album={album} />
                ))}
              </ThemedView>
            ) : null}
            {activeTab === "Artist" ? (
              <ThemedView style={{ marginTop: 24 }}>
                {artist.map((artist, index) => (
                  <ArtistList key={index} artist={artist} />
                ))}
              </ThemedView>
            ) : null}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Library;
