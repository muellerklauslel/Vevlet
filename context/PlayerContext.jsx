import TrackPlayer, { Event, State } from "react-native-track-player";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as TrackPlayerService from "../services/trackPlayerService";
import {
  addTracksToQueue,
  setQueue as setQueueService,
} from "../services/trackPlayerService";

const DEFAULT_TRACK = {
  id: null,
  title: "Unbekannter Song",
  artist: "Unbekannter Artist",
  album: "Unbekanntes Album",
  duration: 0,
  color1: "#8b5e3c",
  color2: "#c9a96e",
};

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  // State Management
  const [currentTrack, setCurrentTrack] = useState(DEFAULT_TRACK);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const [progress, setProgress] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [progressDuration, setProgressDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs
  const intervalRef = useRef(null);
  const listenerUnsubscribersRef = useRef([]);

  /**
   * Inizialisiert den TrackPlayer beim Component Mount
   */
  useEffect(() => {
    const initPlayer = async () => {
      try {
        await TrackPlayerService.initializeTrackPlayer();
        await TrackPlayerService.setVolume(volume);
        setIsInitialized(true);
        setupListeners();
      } catch (error) {
        console.error("❌ Fehler bei PlayerContext Initialisierung:", error);
      }
    };

    initPlayer();

    // Cleanup
    return () => {
      clearInterval(intervalRef.current);
      listenerUnsubscribersRef.current.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
      listenerUnsubscribersRef.current = [];
    };
  }, []);

  /**
   * Registriert Listener für TrackPlayer Events
   */
  const setupListeners = useCallback(() => {
    // Playback State Change
    const playbackStateListener = TrackPlayer.addEventListener(
      Event.PlaybackState,
      async (state) => {
        const isNowPlaying = state.state === State.Playing;
        setIsPlaying(isNowPlaying);
      },
    );
    listenerUnsubscribersRef.current.push(playbackStateListener);

    // Track Wechsel
    const trackChangeListener = TrackPlayer.addEventListener(
      Event.PlaybackTrackChanged,
      async ({ nextTrack }) => {
        try {
          if (nextTrack !== null) {
            const track = await TrackPlayer.getActiveTrack();
            if (track) {
              const trackData = {
                id: track.id,
                title: track.title || "Unbekannter Song",
                artist: track.artist || "Unbekannter Artist",
                album: track.album || "Unbekanntes Album",
                duration: track.duration || 0,
                color1: track.color1 || "#8b5e3c",
                color2: track.color2 || "#c9a96e",
              };
              setCurrentTrack(trackData);
              setProgressPosition(0);
            }
          }
        } catch (error) {
          console.error("Fehler beim Track-Wechsel:", error);
        }
      },
    );
    listenerUnsubscribersRef.current.push(trackChangeListener);

    // Progress Update
    const progressListener = TrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      async (event) => {
        setProgressPosition(event.position);
        setProgressDuration(event.duration);
        if (event.duration > 0) {
          setProgress(event.position / event.duration);
        }
      },
    );
    listenerUnsubscribersRef.current.push(progressListener);

    // Queue Ende erreicht
    const queueEndListener = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      async ({ track }) => {
        setIsPlaying(false);
        setProgress(0);
        setProgressPosition(0);
      },
    );
    listenerUnsubscribersRef.current.push(queueEndListener);
  }, []);

  /**
   * Abspielen eines Tracks mit optionaler Queue
   */
  const playTrack = useCallback(async (track, newQueue = null) => {
    try {
      // Wenn neue Queue übergeben, diese laden
      if (newQueue && newQueue.length > 0) {
        const trackIndex = newQueue.findIndex((t) => t.id === track.id);
        await setQueueService(newQueue, Math.max(0, trackIndex));
        setQueue(newQueue);
        setQueueIndex(Math.max(0, trackIndex));
      }

      // Track-Info aktualisieren
      const trackData = {
        id: track.id,
        title: track.title || "Unbekannter Song",
        artist: track.artist || "Unbekannter Artist",
        album: track.album || "Unbekanntes Album",
        duration: track.duration || 0,
        color1: track.color1 || "#8b5e3c",
        color2: track.color2 || "#c9a96e",
      };
      setCurrentTrack(trackData);
      setProgress(0);
      setProgressPosition(0);
      setIsLiked(false);

      // Abspielen
      await TrackPlayerService.togglePlayback();
    } catch (error) {
      console.error("❌ Fehler beim Abspielen des Tracks:", error);
    }
  }, []);

  /**
   * Play/Pause Toggle
   */
  const togglePlay = useCallback(async () => {
    try {
      const newState = await TrackPlayerService.togglePlayback();
      setIsPlaying(newState);
    } catch (error) {
      console.error("❌ Fehler beim Play/Pause Toggle:", error);
    }
  }, []);

  /**
   * Zum nächsten Track springen
   */
  const skipNext = useCallback(async () => {
    try {
      if (queue.length === 0) return;

      let nextIndex;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else {
        nextIndex = (queueIndex + 1) % queue.length;
      }

      await TrackPlayerService.skipToNext();
      setQueueIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
    } catch (error) {
      console.error("❌ Fehler beim Skip Next:", error);
    }
  }, [queue, queueIndex, isShuffle]);

  /**
   * Zum vorherigen Track springen
   */
  const skipPrev = useCallback(async () => {
    try {
      if (queue.length === 0) return;

      // Wenn > 3 Sekunden gespielt → von vorne; sonst vorheriger Track
      if (progressPosition > 3) {
        await TrackPlayerService.seekTo(0);
        setProgressPosition(0);
        setProgress(0);
      } else {
        await TrackPlayerService.skipToPrevious();
        const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
        setQueueIndex(prevIndex);
        setCurrentTrack(queue[prevIndex]);
      }
    } catch (error) {
      console.error("❌ Fehler beim Skip Previous:", error);
    }
  }, [queue, queueIndex, progressPosition]);

  /**
   * Repeat-Modus wechseln (off → all → one → off)
   */
  const cycleRepeat = useCallback(async () => {
    try {
      const nextMode = await TrackPlayerService.cycleRepeatMode(repeatMode);
      setRepeatMode(nextMode);
    } catch (error) {
      console.error("❌ Fehler beim Repeat-Modus Wechsel:", error);
    }
  }, [repeatMode]);

  /**
   * Zu einer Position springen (0-1 ratio)
   */
  const seekTo = useCallback(
    async (ratio) => {
      try {
        const normalizedRatio = Math.max(0, Math.min(1, ratio));
        const newPosition = normalizedRatio * progressDuration;
        await TrackPlayerService.seekTo(newPosition);
        setProgress(normalizedRatio);
        setProgressPosition(newPosition);
      } catch (error) {
        console.error("❌ Fehler beim Seek:", error);
      }
    },
    [progressDuration],
  );

  /**
   * Lautstärke setzen (0-1)
   */
  const setVolumeValue = useCallback(async (newVolume) => {
    try {
      const normalizedVolume = Math.max(0, Math.min(1, newVolume));
      await TrackPlayerService.setVolume(normalizedVolume);
      setVolume(normalizedVolume);
    } catch (error) {
      console.error("❌ Fehler beim Setzen der Lautstärke:", error);
    }
  }, []);

  /**
   * Shuffle Toggle
   */
  const setIsShuffleValue = useCallback((value) => {
    setIsShuffle(value);
  }, []);

  /**
   * Liked Flag setzen
   */
  const setIsLikedValue = useCallback((value) => {
    setIsLiked(value);
  }, []);

  /**
   * Player Fenster öffnen
   */
  const openPlayer = useCallback(() => setPlayerOpen(true), []);

  /**
   * Player Fenster schließen
   */
  const closePlayer = useCallback(() => setPlayerOpen(false), []);

  /**
   * Queue aktualisieren
   */
  const updateQueue = useCallback(async (newQueue) => {
    try {
      if (newQueue && newQueue.length > 0) {
        await addTracksToQueue(newQueue);
        setQueue(newQueue);
      }
    } catch (error) {
      console.error("❌ Fehler beim Aktualisieren der Queue:", error);
    }
  }, []);

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
        progressPosition,
        progressDuration,
        volume,
        playerOpen,
        queue,
        queueIndex,
        isInitialized,

        // Methods
        playTrack,
        togglePlay,
        skipNext,
        skipPrev,
        cycleRepeat,
        seekTo,
        setVolume: setVolumeValue,
        setIsLiked: setIsLikedValue,
        setIsShuffle: setIsShuffleValue,
        openPlayer,
        closePlayer,
        updateQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error(
      "usePlayer muss innerhalb von <PlayerProvider> verwendet werden",
    );
  }
  return ctx;
};
