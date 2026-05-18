import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import TrackPlayer, { PlayerCommand, RepeatMode, Event } from "@rntp/player";

// ─────────────────────────────────────────────
//  Typen / Defaults
// ─────────────────────────────────────────────
const DEFAULT_TRACK = {
  id: null,
  title: "",
  artist: "",
  album: "",
  duration: 0, // in Sekunden
  color1: "#8b5e3c",
  color2: "#c9a96e",
  // artwork: require(...) oder { uri: "..." }
};

const PlayerContext = createContext(null);

// ─────────────────────────────────────────────
//  Provider
// ─────────────────────────────────────────────
export const PlayerProvider = ({ children }) => {
  const setupPlayer = useCallback(async () => {
    await TrackPlayer.setupPlayer({
      contentType: "music",
      handleAudioBecomingNoisy: true,
      cache: { maxSize: 1024 * 1024 * 10 },
      progressSync: {
        intervalSeconds: 30,
      },
      android: {
        wakeMode: "network",
      },
    });
  }, []);

  const setCommands = useCallback(async () => {
    await TrackPlayer.setCommands({
      capabilities: [
        PlayerCommand.Play,
        PlayerCommand.Pause,
        PlayerCommand.SkipToNext,
        PlayerCommand.SkipToPrevious,
      ],
    });
  }, []);

  const setMediaItems = useCallback(async (tracks) => {
    if (tracks.length === 1) await TrackPlayer.setMediaItem(tracks[0]);
    else await TrackPlayer.setMediaItems(tracks);
  }, []);

  const addMediaItems = useCallback(async (tracks) => {
    if (!tracks || !tracks.length) return;
    await TrackPlayer.addMediaItems(tracks);
  }, []);

  const removeMediaItem = useCallback(async (index) => {
    await TrackPlayer.removeMediaItem(index);
  }, []);

  const clear = useCallback(async () => {
    await TrackPlayer.clear();
  }, []);

  const moveMediaItem = useCallback(async (fromIndex, toIndex) => {
    await TrackPlayer.moveMediaItem(fromIndex, toIndex);
  }, []);

  const updateMetaData = useCallback(async (index, metadata) => {
    await TrackPlayer.updateMediaItem(index, metadata);
  }, []);

  const play = useCallback(async () => {
    await TrackPlayer.play();
  }, []);

  const pause = useCallback(async () => {
    await TrackPlayer.pause();
  }, []);

  const stop = useCallback(async () => {
    await TrackPlayer.stop();
  }, []);

  const seekTo = useCallback(async (ratio) => {
    const progress = await TrackPlayer.getProgress();
    const duration = progress?.duration || 0;
    await TrackPlayer.seekTo(ratio * duration);
  }, []);

  const seekBy = useCallback(async (value) => {
    await TrackPlayer.seekBy(value);
  }, []);

  const skipNext = useCallback(async () => {
    await TrackPlayer.skipToNext();
  }, []);

  const skipPrevious = useCallback(async () => {
    await TrackPlayer.skipToPrevious();
  }, []);

  const setPlaybackSpeed = useCallback(async (speed) => {
    await TrackPlayer.setPlaybackSpeed(speed);
  }, []);

  const setVolume = useCallback(async (newVolume) => {
    await TrackPlayer.setVolume(newVolume);
    setVolumeState(newVolume);
  }, []);

  const setPlayerRepeatMode = useCallback(async (mode) => {
    await TrackPlayer.setRepeatMode(mode);
  }, []);

  const setShuffleEnabled = useCallback(async (enabled) => {
    await TrackPlayer.setShuffleEnabled(enabled);
  }, []);

  const setSleepTimer = useCallback((duration) => {
    TrackPlayer.setSleepTimer(duration);
  }, []);

  const setSleepTimerTrack = useCallback((trackId) => {
    TrackPlayer.sleepAfterMediaItemAtIndex();
  }, []);

  const cancelSleepTimer = useCallback(() => {
    TrackPlayer.cancelSleepTimer();
  }, []);

  useEffect(() => {
    (async () => {
      await setupPlayer();
      await setCommands(); // erst nach setup
    })();

    return () => TrackPlayer.destroy();
  }, [setupPlayer, setCommands]);

  const [currentTrack, setCurrentTrack] = useState(
    TrackPlayer.getActiveMediaItem() || null,
  );
  const [queue, setQueue] = useState(TrackPlayer.getQueue() || []);
  const [queueIndex, setQueueIndex] = useState(
    TrackPlayer.getActiveMediaItemIndex() || 0,
  );
  const [isPlaying, setIsPlaying] = useState(TrackPlayer.isPlaying() || false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(
    TrackPlayer.isShuffleEnabled() || false,
  );
  const [repeatMode, setRepeatMode] = useState(
    TrackPlayer.getRepeatMode() || RepeatMode.Off,
  ); // "off" | "all" | "one"
  const [progress, setProgress] = useState({ position: 0, duration: 0 });
  const [volume, setVolumeState] = useState(TrackPlayer.getVolume() || 0.8); // 0–1
  const [playerOpen, setPlayerOpen] = useState(false);

  // Event-Listener für State-Updates
  useEffect(() => {
    const unsubscribers = [];

    const setupListeners = async () => {
      // Aktiver Track wechselt
      unsubscribers.push(
        TrackPlayer.addEventListener(
          Event.ActiveTrackChanged,
          async ({ index }) => {
            if (index !== null && index !== undefined) {
              const track = await TrackPlayer.getActiveMediaItem();
              setCurrentTrack(track);
              setQueueIndex(index);
            }
          },
        ),
      );

      // Play/Pause Status ändert sich
      unsubscribers.push(
        TrackPlayer.addEventListener(Event.IsPlayingChanged, ({ playing }) => {
          setIsPlaying(playing);
        }),
      );

      // Queue änderungen
      unsubscribers.push(
        TrackPlayer.addEventListener(Event.QueueChanged, async () => {
          const newQueue = await TrackPlayer.getQueue();
          setQueue(newQueue);
        }),
      );

      // Fortschritt wird aktualisiert
      unsubscribers.push(
        TrackPlayer.addEventListener(
          Event.PlaybackProgressUpdated,
          ({ position, duration }) => {
            setProgress({ position, duration });
          },
        ),
      );

      // Shuffle ändert sich
      unsubscribers.push(
        TrackPlayer.addEventListener(Event.ShuffleChanged, ({ shuffle }) => {
          setIsShuffle(shuffle);
        }),
      );

      // Repeat Mode ändert sich
      unsubscribers.push(
        TrackPlayer.addEventListener(
          Event.RepeatModeChanged,
          ({ repeatMode }) => {
            setRepeatMode(repeatMode);
          },
        ),
      );

      // Fehlerbehandlung
      unsubscribers.push(
        TrackPlayer.addEventListener(Event.PlaybackError, ({ error }) => {
          console.error("Playback Error:", error);
        }),
      );
    };

    setupListeners();

    return () => unsubscribers.forEach((u) => u?.remove());
  }, []);

  const openPlayer = useCallback(() => setPlayerOpen(true), []);
  const closePlayer = useCallback(() => setPlayerOpen(false), []);

  return (
    <PlayerContext.Provider
      value={{
        // State
        currentTrack,
        isPlaying,
        isLiked,
        isShuffle,
        repeatMode,
        progress,
        volume,
        setVolume: setVolume,
        playerOpen,
        queue,
        queueIndex,
        // Aktionen
        play,
        pause,
        stop,
        setPlaybackSpeed,
        setPlayerRepeatMode,
        setShuffleEnabled,
        setMediaItems,
        addMediaItems,
        removeMediaItem,
        clear,
        moveMediaItem,
        updateMetaData,
        skipNext,
        skipPrevious,
        seekTo,
        setVolume,
        setIsLiked,
        setIsShuffle,
        openPlayer,
        closePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// ─────────────────────────────────────────────
//  Hook
// ─────────────────────────────────────────────
export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx)
    throw new Error(
      "usePlayer muss innerhalb von <PlayerProvider> verwendet werden",
    );
  return ctx;
};
