import { Text, useColorScheme, Pressable } from "react-native";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";

const GenreCard = ({ title, style, color, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Pressable
      style={[
        {
          width: "48%",
          height: 100,
          backgroundColor: color,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: 16,
          borderRadius: Colors.radius,
        },
        style,
      ]}
      {...props}
    >
      <ThemedText
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: theme.TEXT,
          fontFamily: FONTS.bodyBold,
        }}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
};

export default GenreCard;
