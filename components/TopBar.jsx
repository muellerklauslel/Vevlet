import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { useFonts } from "expo-font";
import { Colors } from "../constants/Colors";

// FONTS
import { FONTS } from "../assets/fonts/fonts"; // Fonts
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from "@expo-google-fonts/dm-serif-display";
import { DMSans_400Regular, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import ThemedView from "../components/ThemedView";
import AccentText from "../components/AccentText";
import ThemedText from "../components/ThemedText";
import MutedText from "../components/MutedText";

const TopBar = () => {
  const tageszeit = (() => {
    const stunde = new Date().getHours();
    if (stunde < 12) return "Morgen";
    if (stunde < 18) return "Tag";
    return "Abend";
  })();

  const [fontsLoaded] = useFonts({
    DMSerifDisplay: DMSerifDisplay_400Regular,
    DMSans: DMSans_400Regular,
    DMSansBold: DMSans_700Bold,
    DMSerifDisplay_400Regular_Italic: DMSerifDisplay_400Regular_Italic,
  });

  return (
    <ThemedView>
      <ThemedView style={styles.topbar}>
        <AccentText style={styles.topbar.brandName}>Vevlet</AccentText>
      </ThemedView>
      <ThemedView style={styles.topbar.header}>
        <MutedText style={styles.topbar.header.greeting}>
          Guten {tageszeit}
        </MutedText>
        <ThemedText style={styles.topbar.header.caption}>
          Hör dir was{" "}
          <AccentText style={styles.topbar.header.em}>schönes</AccentText> an
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  topbar: {
    display: "flex",
    padding: 14,
    paddingTop: 0,
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
    flexShrink: 0,

    brandName: {
      fontSize: 16,
      fontFamily: FONTS.display,
      fontStyle: "serif",
      letterSpacing: 1,
      fontWeight: "500",
    },

    header: {
      paddingTop: 20,
      //   paddingLeft: 24,
      //   paddingRight: 24,
      paddingBottom: 0,
      display: "flex",
      alignItems: "flex-start",

      greeting: {
        fontSize: 12,
        marginBottom: 2,
        fontFamiliy: FONTS.body,
        fontStyle: FONTS.body,
        justifyContent: "left",
      },

      caption: {
        fontFamily: FONTS.display,
        fontSize: 28,
        fontWeight: "500",
        //   lineHeight: 1.1,
      },

      em: {
        fontFamily: FONTS.bodyItalic,
      },
    },
  },
});
