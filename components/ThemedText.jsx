import { Text, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";

const ThemedText = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Text
      style={[{ color: theme.TEXT, fontFamily: FONTS.body }, style]}
      {...props}
    />
  );
};

export default ThemedText;
