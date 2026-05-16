import TrackPlayer, {
  Capability,
  RepeatMode,
  State,
} from "react-native-track-player";
import { trackPlayerBackground } from "./trackPlayerBackground";

/**
 * Initialisiert den TrackPlayer mit Grundkonfiguration und Background Service
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

    // Registriere Background Task Handler
    await TrackPlayer.registerPlaybackService(() => trackPlayerBackground());

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
 * Startet die Wiedergabe eines Tracks
 */
export async function playTrack(trackIndex = 0) {
  try {
    await TrackPlayer.skip(trackIndex);
    await TrackPlayer.play();
    return true;
  } catch (error) {
    console.error("❌ Fehler beim Abspielen des Tracks:", error);
    throw error;
  }
}

/**
 * Play/Pause Toggle
 */
export async function togglePlayback() {
  try {
    const state = await TrackPlayer.getPlaybackState();
    if (state.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    return state.state !== State.Playing;
  } catch (error) {
    console.error("❌ Fehler beim Toggle:", error);
    throw error;
  }
}

/**
 * Skip zum nächsten Track
 */
export async function skipToNext() {
  try {
    await TrackPlayer.skipToNext();
    return true;
  } catch (error) {
    console.error("❌ Fehler beim Skip Next:", error);
    throw error;
  }
}

/**
 * Skip zum vorherigen Track
 */
export async function skipToPrevious() {
  try {
    const position = await TrackPlayer.getPosition();
    // Wenn > 3 Sekunden gespielt, von vorne starten, sonst vorheriger Track
    if (position > 3) {
      await TrackPlayer.seekTo(0);
    } else {
      await TrackPlayer.skipToPrevious();
    }
    return true;
  } catch (error) {
    console.error("❌ Fehler beim Skip Previous:", error);
    throw error;
  }
}

/**
 * Springe zu einer bestimmten Position (in Sekunden)
 */
export async function seekTo(position) {
  try {
    await TrackPlayer.seekTo(Math.max(0, position));
    return true;
  } catch (error) {
    console.error("❌ Fehler beim Seek:", error);
    throw error;
  }
}

/**
 * Setze die Lautstärke (0-1)
 */
export async function setVolume(volume) {
  try {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    await TrackPlayer.setVolume(normalizedVolume);
    return true;
  } catch (error) {
    console.error("❌ Fehler beim Setzen der Lautstärke:", error);
    throw error;
  }
}

/**
 * Setze Shuffle-Modus
 */
export async function setShuffle(enabled) {
  try {
    // TrackPlayer hat keinen nativen Shuffle-Modus,
    // das wird auf Context-Ebene gehandhabt
    return true;
  } catch (error) {
    console.error("❌ Fehler beim Setzen von Shuffle:", error);
    throw error;
  }
}

/**
 * Wechsle den Repeat-Modus
 */
export async function cycleRepeatMode(currentMode) {
  try {
    const nextMode =
      currentMode === "off" ? "all" : currentMode === "all" ? "one" : "off";
    await TrackPlayer.setRepeatMode(getRepeatModeValue(nextMode));
    return nextMode;
  } catch (error) {
    console.error("❌ Fehler beim Wechsel des Repeat-Modus:", error);
    throw error;
  }
}

/**
 * Hole den aktuellen Playback-Status
 */
export async function getPlaybackState() {
  try {
    const state = await TrackPlayer.getPlaybackState();
    return {
      isPlaying: state.state === State.Playing,
      state: state.state,
    };
  } catch (error) {
    console.error("❌ Fehler beim Abrufen des Playback-Status:", error);
    throw error;
  }
}

/**
 * Hole den aktuellen Track
 */
export async function getCurrentTrack() {
  try {
    const track = await TrackPlayer.getActiveTrack();
    return track;
  } catch (error) {
    console.error("❌ Fehler beim Abrufen des aktuellen Tracks:", error);
    throw error;
  }
}

/**
 * Hole die aktuelle Position (Sekunden)
 */
export async function getPosition() {
  try {
    const position = await TrackPlayer.getPosition();
    return position;
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Position:", error);
    return 0;
  }
}

/**
 * Hole die Dauer des aktuellen Tracks (Sekunden)
 */
export async function getDuration() {
  try {
    const track = await TrackPlayer.getActiveTrack();
    return track?.duration || 0;
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Dauer:", error);
    return 0;
  }
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
