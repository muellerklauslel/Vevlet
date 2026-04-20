import { Pressable, Text, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import MutedText from "./MutedText";
import Toggle from "./Toggle";
import { Ionicons } from "@expo/vector-icons";

const SettingListItem = ({
  style,
  key,
  name,
  description,
  link,
  icon,
  tag,
  type,
  ...props
}) => {
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
      onPress={() => console.log("Setting gedrückt: " + name)}
      //   {...props}
    >
      <ThemedView
        colors={[theme.ACCENT, theme.ACCENT2]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 10,
          height: 50,
          width: 50,
          backgroundColor: theme.SURFACE3,
        }}
      >
        {/* Setting Icon */}
        <Ionicons
          name="person"
          size={24}
          style={{ alignSelf: "center" }}
          color={theme.ACCENT}
        ></Ionicons>
      </ThemedView>

      <ThemedView
        style={{
          marginLeft: 78,
          fontFamily: FONTS.body,
          position: "relative",
          top: -10,
          display: "flex",
        }}
      >
        <ThemedText
          style={{
            color: theme.ACCENT,

            fontSize: 18,
          }}
        >
          {"Setting Name"}
        </ThemedText>
        <MutedText
          style={{
            color: theme.MUTED,
            fontSize: 12,
          }}
        >
          {"Setting Description"}
        </MutedText>
      </ThemedView>
      <Toggle></Toggle>
    </Pressable>
  );
};

export default SettingListItem;
