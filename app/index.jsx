import { StyleSheet, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// CSS variables
const ACCENT = "#c9a96e";
const BG = "#0a0a0f";
const SURFACE = "#13131a";
const SURFACE2 = "#1c1c26";
const SURFACE3 = "#242432";
const ACCENT2 = "#e8c98a";
const TEXT = "#f0eeea";
const MUTED = "#8a8a9a";
const DIM = "#4a4a5a";
const RADIUS = "16px";
const FONTDISPLAY = "DM Serif Display";
const FONTDISPLAYSTYLE = "serif";
const FONTBODY = "DM Sans";
const FONTBODYSTYLE = "sans-serif";

const tageszeit = (() => {
  const stunde = new Date().getHours();
  if (stunde < 12) return "Morgen";
  if (stunde < 18) return "Tag";
  return "Abend";
})();

const MOODS = ["Alles", "Musik", "Podcast"];

const Home = () => {
  const [selected, setSelected] = useState("Alle");
  return (
    // App
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.root}>
          {/* Topbar */}
          <View style={styles.topbar}>
            <Text style={styles.topbar.brandName}>Vevlet</Text>
          </View>
          <View style={styles.topbar.header}>
            <Text style={styles.topbar.header.greeting}>Guten {tageszeit}</Text>
            <Text style={styles.topbar.header.caption}>
              Hör dir was <em style={styles.topbar.header.em}>schönes</em> an
            </Text>
          </View>

          {/* Music / Podcast selector */}
          <View style={styles.musicSelector}>
            <Pressable
              style={[
                styles.musicSelector.item,
                selected === "Alles" && styles.musicSelector.item.active,
              ]}
              onPress={() => setSelected("Alles")}
            >
              <Text
                style={[
                  styles.musicSelector.item.text,
                  selected === "Alles" && styles.musicSelector.item.active.text,
                ]}
              >
                Alles
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.musicSelector.item,
                selected === "Musik" && styles.musicSelector.item.active,
              ]}
              onPress={() => setSelected("Musik")}
            >
              <Text
                style={[
                  styles.musicSelector.item.text,
                  selected === "Musik" && styles.musicSelector.item.active.text,
                ]}
              >
                Musik
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.musicSelector.item,
                selected === "Podcast" && styles.musicSelector.item.active,
              ]}
              onPress={() => setSelected("Podcast")}
            >
              <Text
                style={[
                  styles.musicSelector.item.text,
                  selected === "Podcast" &&
                    styles.musicSelector.item.active.text,
                ]}
              >
                Podcast
              </Text>
            </Pressable>
          </View>

          {/*  */}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#0a0a0f",
  },

  body: {
    fontFamily: "DM Sans",
    fontStyle: "sans-serif",
  },

  topbar: {
    display: "flex",
    padding: 14,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 0,
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
    flexShrink: 0,

    brandName: {
      fontSize: 16,
      color: ACCENT,
      fontFamily: "DM Serif Display",
      fontStyle: "serif",
      letterSpacing: 1,
      fontWeight: "500",
    },

    header: {
      paddingTop: 20,
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 0,
      display: "flex",
      alignItems: "flex-start",

      greeting: {
        fontSize: 12,
        color: MUTED,
        marginBottom: 2,
        fontFamiliy: FONTBODY,
        fontStyle: FONTBODYSTYLE,
        justifyContent: "left",
      },

      caption: {
        fontFamily: FONTDISPLAY,
        fontStyle: FONTDISPLAYSTYLE,
        fontSize: 28,
        color: TEXT,
        fontWeight: "500",
        //   lineHeight: 1.1,
      },

      em: {
        color: ACCENT,
        fontStyle: "italic",
      },
    },
  },

  musicSelector: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingLeft: 24,
    paddingRight: 24,
    flexWrap: "wrap",

    item: {
      backgroundColor: SURFACE3,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 20,
      fontSize: 12,
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      fontFamily: FONTBODY,
      fontStyle: FONTBODYSTYLE,
      fontWeight: "500",

      text: {
        transition: "all 0.2s ease-in-out",
        color: MUTED,
      },

      active: {
        transition: "all 0.2s ease-in-out",
        backgroundColor: ACCENT,

        text: {
          transition: "all 0.2s ease-in-out",
          color: "'#0a0a0f'",
        },
      },
    },
  },
});
