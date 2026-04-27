import { Pressable, useColorScheme, Linking } from "react-native";
import { Colors } from "../constants/Colors";
import { FONTS } from "../assets/fonts/fonts";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import MutedText from "./MutedText";
import Toggle from "./Toggle";
import { Ionicons } from "@expo/vector-icons";

const SettingListItem = ({
  style,
  name,
  description,
  link,
  icon = "settings",
  type = "menu",
  onToggle,
  onPress,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  // Handle press based on type
  const handlePress = () => {
    if (type === "toggle" && onToggle) {
      onToggle();
    } else if (type === "link" && link) {
      Linking.openURL(link);
    } else if (type === "menu" && onPress) {
      onPress();
    } else if (onPress) {
      onPress();
    }
  };

  // Determine right-side element based on type
  const renderRightElement = () => {
    switch (type) {
      case "toggle":
        return <Toggle onChange={onToggle} />;
      case "menu":
        return (
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.MUTED}
            style={{ marginRight: 12 }}
          />
        );
      case "link":
        return (
          <Ionicons
            name="open-outline"
            size={20}
            color={theme.MUTED}
            style={{ marginRight: 12 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Pressable
      style={[
        {
          fontFamily: FONTS.body,
          height: 70,
          width: "100%",
          backgroundColor: theme.SURFACE3,
          borderRadius: Colors.radius,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          // marginTop: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.DIM,
          paddingHorizontal: 12,
        },
        style,
      ]}
      onPress={handlePress}
      {...props}
    >
      {/* Left Section: Icon */}
      <ThemedView
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          height: 50,
          width: 50,
          backgroundColor: theme.SURFACE,
        }}
      >
        <Ionicons name={icon} size={24} color={theme.ACCENT} />
      </ThemedView>

      {/* Middle Section: Text Content */}
      <ThemedView
        style={{
          backgroundColor: theme.SURFACE3,
          flex: 1,
          marginLeft: 16,
          justifyContent: "center",
        }}
      >
        <ThemedText
          style={{
            color: theme.ACCENT,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          {name}
        </ThemedText>
        {description && (
          <MutedText
            style={{
              color: theme.MUTED,
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {description}
          </MutedText>
        )}
      </ThemedView>

      {/* Right Section: Type-specific element */}
      {renderRightElement()}
    </Pressable>
  );
};

export default SettingListItem;
