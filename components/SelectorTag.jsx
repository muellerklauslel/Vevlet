import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedText from "./ThemedText";

const SelectorTag = ({ style, children, isActive, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Pressable
      {...props}
      style={[
        {
          backgroundColor: isActive ? theme.ACCENT : theme.SURFACE3,
          paddingHorizontal: 14,
          paddingVertical: 5,
          borderRadius: 20,
          fontSize: 12,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          fontFamily: FONTS.body,
          fontStyle: FONTS.body,
          fontWeight: "500",
        },
        style,
      ]}
    >
      <ThemedText
        style={[
          {
            transition: "all 0.2s ease-in-out",
            color: isActive ? theme.BG : theme.MUTED,
            fontFamily: FONTS.body,
          },
        ]}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
};

export default SelectorTag;
