import { Image, Pressable, Text, useColorScheme } from "react-native";
import { useState } from "react";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import MutedText from "./MutedText";
import { Ionicons } from "@expo/vector-icons";
import { usePlayer } from "../context/PlayerContext";

const MiniPlayer = ({ style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.light;

  const {
    currentTrack,
    isPlaying,
    progress,
    togglePlay,
    skipNext,
    openPlayer,
  } = usePlayer();

  const togglePlayPause = () => {
    togglePlay();
  };

  return (
    <Pressable
      onPress={() => {
        console.log("Miniplayer pressed");
        openPlayer();
      }}
      style={[
        {
          backgroundColor: theme.SURFACE3,
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          marginHorizontal: 12,
          marginBottom: 8,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: "https://i.scdn.co/image/ab67616d00004851..." }}
        style={{ width: 50, height: 50, borderRadius: 4 }}
      />
      <ThemedView style={{ backgroundColor: theme.SURFACE3 }}>
        <ThemedText
          style={{
            marginLeft: 12,
            fontFamily: FONTS.body,
            maxWidth: "70%",
          }}
        >
          Songtitel
        </ThemedText>
        <MutedText style={{ marginLeft: 12, fontSize: 12 }}>
          Artist 1, Artist 2
        </MutedText>
      </ThemedView>

      <Pressable
        onPress={togglePlayPause}
        style={{ padding: 8, marginLeft: "auto", position: "static" }}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={24}
          color={theme.ACCENT}
          style={{ marginLeft: "auto" }}
        />
      </Pressable>
    </Pressable>
  );
};

export default MiniPlayer;
