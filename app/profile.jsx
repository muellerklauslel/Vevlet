import { Image, ScrollView, Text, View, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import MutedText from "../components/MutedText";
import SettingListItem from "../components/SettingListItem";

const profile = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <SafeAreaProvider
      style={{ backgroundColor: theme.BG, fontFamily: FONTS.body }}
    >
      <SafeAreaView>
        <ScrollView>
          <ThemedView style={{ marginHorizontal: 24 }}>
            {/* Header */}
            <ThemedView style={{ marginTop: 24 }}>
              <Image
                source={
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItaWNvbiBsdWNpZGUtdXNlciI+PHBhdGggZD0iTTE5IDIxdi0yYTQgNCAwIDAgMC00LTRIOWE0IDQgMCAwIDAtNCA0djIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiLz48L3N2Zz4="
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: theme.ACCENT,
                  alignSelf: "center",
                }}
              />

              <ThemedText
                style={{
                  alignSelf: "center",
                  fontFamily: FONTS.display,
                  fontSize: 32,
                  marginTop: 12,
                }}
              >
                Username
              </ThemedText>
              <MutedText style={{ alignSelf: "center" }}>
                user@vevlet.com
              </MutedText>

              <ThemedView
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 16,
                  backgroundColor: theme.SURFACE3,
                  borderColor: theme.MUTED,
                  borderWidth: 1,
                  alignSelf: "center",
                  marginTop: 12,
                  borderRadius: Colors.radius,
                }}
              >
                <ThemedText style={{ color: theme.ACCENT }}>
                  Vevlet Premium
                </ThemedText>
              </ThemedView>
            </ThemedView>

            {/* Stats */}

            {/* Settings */}
            <ThemedView style={{ marginTop: 30 }}>
              <MutedText>Einstellungen</MutedText>
              <ThemedView
                style={{
                  backgroundColor: theme.SURFACE3,
                  borderRadius: Colors.radius,
                }}
              >
                <SettingListItem
                  type="menu"
                  icon="person-outline"
                  name={"Konto"}
                  onPress={() => console.log("Konto Menü gedrückt")}
                  description={"user@vevlet.com"}
                />
                <SettingListItem
                  type="menu"
                  icon="ribbon-outline"
                  name="Abo verwalten"
                  onPress={() => console.log("Abo verwalten Menü gedrückt")}
                  description={"Ändere oder kündige dein Abo"}
                />
                <SettingListItem
                  type="menu"
                  icon="podium-outline"
                  name={"Hörstatistiken"}
                  onPress={() => console.log("Hörstatistiken Menü gedrückt")}
                />
              </ThemedView>

              <MutedText
                style={{
                  marginTop: 20,
                }}
              >
                Weitere Optionen
              </MutedText>
              <ThemedView
                style={{
                  backgroundColor: theme.SURFACE3,
                  borderRadius: Colors.radius,
                }}
              >
                <SettingListItem
                  name="Wiedergabequalität"
                  icon="volume-high-outline"
                  type="menu"
                  onPress={() => console.log("Wiedergabequali gedrückt")}
                />
                <SettingListItem
                  name="Offline Modus"
                  description={
                    "Es werden nur Inhalte angezeigt, die runtergeladen wurden"
                  }
                  icon="cloud-offline-outline"
                  type="toggle"
                  onToggle={() => console.log("Offlinemodus gedrückt")}
                />
              </ThemedView>

              <MutedText style={{ marginTop: 20 }}>Rechtliches</MutedText>
              <ThemedView
                style={{
                  backgroundColor: theme.SURFACE3,
                  borderRadius: Colors.radius,
                  marginBottom: 100,
                }}
              >
                <SettingListItem
                  name="Datenschutzrichtlinien"
                  icon="shield-checkmark-outline"
                  type="link"
                  link="https://vevlet.com/privacy"
                />
                <SettingListItem
                  name="Nutzungsbedingungen"
                  icon="document-text-outline"
                  type="link"
                  link="https://vevlet.com/terms"
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default profile;
