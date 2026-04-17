import { View, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

const ThemedView = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return <View style={[{ backgroundColor: theme.BG }, style]} {...props} />;
};

export default ThemedView;
