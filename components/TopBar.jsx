import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";

// FONTS
import { FONTS } from "../assets/fonts/fonts";
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
      // paddingTop: 20,
      //   paddingLeft: 24,
      //   paddingRight: 24,
      paddingBottom: 0,
      display: "flex",
      alignItems: "flex-start",

      greeting: {
        fontSize: 12,
        marginBottom: 2,
        fontFamily: FONTS.body,
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
