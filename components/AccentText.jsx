import { Text, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";

const AccentText = ({ style, children, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Text
      style={[{ color: theme.ACCENT, fontFamily: FONTS.body }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AccentText;
