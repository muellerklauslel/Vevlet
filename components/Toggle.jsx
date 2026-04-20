import { useState } from "react";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import ThemedView from "./ThemedView";

const Toggle = ({ initial = false }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [on, setOn] = useState(initial);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setOn((v) => !v)}
      style={[
        {
          width: 40,
          height: 24,
          borderRadius: 12,
          justifyContent: "center",
          flexShrink: 0,
        },
        on
          ? { backgroundColor: theme.ACCENT }
          : { backgroundColor: theme.SURFACE3 },
      ]}
    >
      <ThemedView
        style={[
          {
            position: "absolute",
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: theme.BG,
          },
          on ? { right: 3 } : { left: 3 },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {},
  toggleOn: {},
  toggleOff: {},
  toggleKnob: {},
  knobRight: {},
  knobLeft: {},
});

export default Toggle;
