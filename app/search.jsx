import {
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FONTS } from "../assets/fonts/fonts";
import { Colors } from "../constants/Colors";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import MutedText from "../components/MutedText";
import GenreCard from "../components/GenreCard";
import { Ionicons } from "@expo/vector-icons";

const Search = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <SafeAreaProvider
      style={{ backgroundColor: theme.BG, fontFamily: FONTS.body }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <ThemedView style={{ marginLeft: 24, marginRight: 24 }}>
            <ThemedView>
              <ThemedText
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 32,
                  color: theme.ACCENT,
                }}
              >
                Entdecken
              </ThemedText>
            </ThemedView>

            {/* Input Search */}
            <ThemedView
              style={{
                backgroundColor: theme.SURFACE3,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginTop: 16,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: Colors.radius,
              }}
            >
              <Ionicons
                name="search"
                size={24}
                color={theme.MUTED}
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder="Suche..."
                placeholderTextColor={theme.MUTED}
                style={{
                  color: theme.TEXT,
                  height: 40,
                  flex: 1,
                  fontSize: 16,
                }}
              />
            </ThemedView>

            {/* Genre Grid */}
            <ThemedView>
              <MutedText
                style={{
                  color: theme.MUTED,
                  fontSize: 16,
                  fontWeight: "bold",
                  marginTop: 16,
                }}
              >
                GENRES
              </MutedText>

              <ThemedView
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <GenreCard
                  title="Pop"
                  color={"#8b3a3a"}
                  onPress={() => console.log("Pop pressed")}
                />
                <GenreCard
                  title="Rock"
                  color={"#1a3a6a"}
                  onPress={() => console.log("Rock pressed")}
                />
                <GenreCard
                  title="Hip-Hop"
                  color={"#ff6b6b"}
                  onPress={() => console.log("Hip-Hop pressed")}
                />
                <GenreCard
                  title="Jazz"
                  color={"#4ecdc4"}
                  onPress={() => console.log("Jazz pressed")}
                />
                <GenreCard
                  title="Klassik"
                  color={"#45b7d1"}
                  onPress={() => console.log("Klassik pressed")}
                />
                <GenreCard
                  title="Elektronisch"
                  color={"#96ceb4"}
                  onPress={() => console.log("Elektronisch pressed")}
                />
                <GenreCard
                  title="Reggae"
                  color={"#ffcc5c"}
                  onPress={() => console.log("Reggae pressed")}
                />
                <GenreCard
                  title="Blues"
                  color={"#88d8b0"}
                  onPress={() => console.log("Blues pressed")}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
};

export default Search;
