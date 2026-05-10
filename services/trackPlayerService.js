import TrackPlayer, { Capability, RepeatMode } from "react-native-track-player";

/**
 * Initialisiert den TrackPlayer mit Grundkonfiguration
 */
export async function initializeTrackPlayer() {
  try {
    // Hole den aktuellen Status
    const isSetup = await TrackPlayer.isServiceRunning();
    if (isSetup) {
      return true;
    }

    // Setup Player
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 100, // 100 MB
    });

    // Update Options - welche Controls im Lockscreen verfügbar sein sollen
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.JumpForward,
        Capability.JumpBackward,
        Capability.Stop,
        Capability.Like,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      jumpInterval: 15, // Springe 15 Sekunden vor/zurück
    });

    // Initiales Repeat-Modus
    await TrackPlayer.setRepeatMode(RepeatMode.Off);

    return true;
  } catch (error) {
    console.error("❌ Fehler beim Initialisieren von TrackPlayer:", error);
    throw error;
  }
}

/**
 * Fügt eine Liste von Tracks zur Queue hinzu
 */
export async function addTracksToQueue(tracks) {
  try {
    const formattedTracks = tracks.map((track) => ({
      id: track.id,
      url: track.url,
      title: track.title || "unbekannter Song",
      artist: track.artist || "unbekannter Artist",
      album: track.album || "unbekanntes Album",
      duration: track.duration || 0,
      artwork: track.artwork || null,
    }));

    await TrackPlayer.add(formattedTracks);
    return true;
  } catch (error) {
    console.error("❌ Fehler beim Hinzufügen von Tracks:", error);
    throw error;
  }
}

/**
 * Setzt die komplette Queue
 */
export async function setQueue(tracks, startIndex = 0) {
  try {
    await TrackPlayer.reset();
    await addTracksToQueue(tracks);
    if (startIndex > 0) {
      await TrackPlayer.skip(startIndex);
    }
    return true;
  } catch (error) {
    console.error("❌ Fehler beim Setzen der Queue:", error);
    throw error;
  }
}

/**
 * Konvertiert Repeat-Modus String zu TrackPlayer RepeatMode
 */
export function getRepeatModeValue(repeatMode) {
  const modeMap = {
    off: RepeatMode.Off,
    all: RepeatMode.Queue,
    one: RepeatMode.Track,
  };
  return modeMap[repeatMode] || RepeatMode.Off;
}

/**
 * Konvertiert TrackPlayer RepeatMode zu String
 */
export function getRepeatModeString(repeatMode) {
  const modeMap = {
    [RepeatMode.Off]: "off",
    [RepeatMode.Queue]: "all",
    [RepeatMode.Track]: "one",
  };
  return modeMap[repeatMode] || "off";
}
