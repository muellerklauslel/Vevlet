import { Image, View, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import MutedText from "./MutedText";

const PlaylistCard = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <>
      <ThemedView
        style={[
          {
            height: 260,
            width: 220,
            borderRadius: 20,
            backgroundColor: theme.SURFACE3,
            marginTop: 20,
            marginRight: 15,
          },
        ]}
      >
        <Image
          source={require("../assets/placeholders/playlist-placeholder.png")}
          style={{
            width: 120,
            height: 120,
            // borderRadius: 8,
            // color: "white",
            flex: 0,
            marginTop: "auto",
            alignSelf: "center",
            marginBottom: 30,
          }}
        />
        <View style={{ marginBottom: "auto" }}>
          <ThemedText
            style={{
              fontFamily: FONTS.display,
              fontSize: 24,
              textAlign: "left",
              marginLeft: 10,
            }}
          >
            Midnight Vevlet
          </ThemedText>
          <MutedText style={{ marginLeft: 10 }}>48 Songs · 3h 12m</MutedText>
        </View>
      </ThemedView>
    </>
  );
};

export default PlaylistCard;
