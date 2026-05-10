import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import TrackPlayer from "react-native-track-player";
import { PlaybackService } from "./services/trackPlayerService";

// RNTP Playback Service registrieren
TrackPlayer.registerPlaybackService(() => PlaybackService);

// Expo Router Entry
const App = () => {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
};

registerRootComponent(App);
