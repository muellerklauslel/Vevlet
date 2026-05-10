import { Pressable, Text, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import MutedText from "./MutedText";

const ArtistList = ({ style, isPlaying, key, artist, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Pressable
      style={[
        {
          color: theme.ACCENT,
          fontFamily: FONTS.body,
          height: 50,
          width: "100%",
          backgroundColor: theme.BG,
          borderRadius: 8,
          display: "flex",
          alignItems: "left",
          justifyContent: "flex-end",
          height: 70,
          marginTop: 10,
        },
        style,
      ]}
      onPress={() => console.log("Artist gedrückt: " + artist?.name)}
    >
      <LinearGradient
        colors={[theme.ACCENT, theme.ACCENT2]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 35,
          height: 70,
          width: 70,
        }}
      />

      <ThemedView
        style={{
          marginLeft: 78,
          fontFamily: FONTS.body,
          position: "relative",
          top: -10,
        }}
      >
        <ThemedText
          style={{
            color: isPlaying ? theme.ACCENT : theme.TEXT,

            fontSize: 18,
          }}
        >
          {artist?.name || "Playlist Name"}
        </ThemedText>
        <MutedText
          style={{
            color: isPlaying ? theme.ACCENT : theme.MUTED,
            fontSize: 12,
          }}
        >
          {artist?.artists?.map((artist) => artist.name).join(", ") ||
            "Artist Name"}
        </MutedText>
      </ThemedView>
    </Pressable>
  );
};

export default ArtistList;
