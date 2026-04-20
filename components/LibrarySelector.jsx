import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedText from "./ThemedText";

const LibrarySelector = ({ style, children, isActive, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Pressable
      {...props}
      style={[
        {
          backgroundColor: isActive ? theme.SURFACE3 : theme.SURFACE2,
          paddingHorizontal: 14,
          paddingVertical: 5,
          borderRadius: 10,
          width: "33%",
          height: 35,
          fontSize: 12,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          fontFamily: FONTS.body,
          justifyContent: "space-evenly",
          alignItems: "center",
          fontWeight: "500",
        },
        style,
      ]}
    >
      <ThemedText
        style={[
          {
            transition: "all 0.2s ease-in-out",
            color: isActive ? theme.TEXT : theme.MUTED,
            fontFamily: FONTS.body,
          },
        ]}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
};

export default LibrarySelector;
