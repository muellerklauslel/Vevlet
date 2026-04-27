import { useState } from "react";
import { ScrollView, Text, View, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import LibrarySelector from "../components/LibrarySelector";
import PlaylistList from "../components/PlaylistList";
import AlbumList from "../components/AlbumList";
import ArtistList from "../components/ArtistList";
import MiniPlayer from "../components/MiniPlayer";

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

  return (
    <SafeAreaProvider
      style={{ backgroundColor: theme.BG, fontFamily: FONTS.body }}
    >
      <SafeAreaView>
        <ScrollView style={{ height: "100%" }}>
          <ThemedView style={{ marginLeft: 24, marginRight: 24 }}>
            <ThemedText
              style={{
                fontFamily: FONTS.display,
                fontSize: 32,
                color: theme.ACCENT,
              }}
            >
              Bibliothek
            </ThemedText>

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
            {activeTab === "Playlist" && (
              <ThemedView style={{ marginTop: 24 }}>
                {playlists.map((playlist) => (
                  <PlaylistList key={playlist.id} playlist={playlist} />
                ))}
              </ThemedView>
            )}
            {activeTab === "Album" && (
              <ThemedView style={{ marginTop: 24 }}>
                {albums.map((album) => (
                  <AlbumList key={album.id} album={album} />
                ))}
              </ThemedView>
            )}
            {activeTab === "Artist" && (
              <ThemedView style={{ marginTop: 24 }}>
                {artist.map((artist) => (
                  <ArtistList key={artist.id} artist={artist} />
                ))}
              </ThemedView>
            )}
          </ThemedView>
        </ScrollView>

        {/* MiniPlayer */}
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

export default Library;
