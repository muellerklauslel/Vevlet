import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

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
  const [currentTrack, setCurrentTrack] = useState(DEFAULT_TRACK);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playerOpen, setPlayerOpen] = useState(false);

  const intervalRef = useRef(null);

  const startProgress = useCallback((duration) => {
    clearInterval(intervalRef.current);
    if (!duration) return;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return p + 1 / duration / 10;
      });
    }, 100);
  }, []);

  const playTrack = useCallback(
    (track, newQueue = null) => {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
      setIsLiked(false);

      if (newQueue) {
        setQueue(newQueue);
        setQueueIndex(newQueue.findIndex((t) => t.id === track.id));
      }

      startProgress(track.duration);
    },
    [startProgress],
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      if (p) clearInterval(intervalRef.current);
      else startProgress(currentTrack.duration);
      return !p;
    });
  }, [currentTrack.duration, startProgress]);

  const skipNext = useCallback(() => {
    if (!queue.length) return;
    const nextIndex = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : (queueIndex + 1) % queue.length;
    setQueueIndex(nextIndex);
    playTrack(queue[nextIndex]);
  }, [queue, queueIndex, isShuffle, playTrack]);

  const skipPrev = useCallback(() => {
    // Wenn > 3 Sekunden gespielt → von vorne; sonst vorheriger Track
    if (progress > 0.05 || !queue.length) {
      setProgress(0);
      startProgress(currentTrack.duration);
      return;
    }
    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIndex);
    playTrack(queue[prevIndex]);
  }, [
    queue,
    queueIndex,
    progress,
    currentTrack.duration,
    startProgress,
    playTrack,
  ]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));
  }, []);

  const seekTo = useCallback(
    (ratio) => {
      setProgress(Math.max(0, Math.min(1, ratio)));
      if (isPlaying) startProgress(currentTrack.duration * (1 - ratio));
    },
    [isPlaying, currentTrack.duration, startProgress],
  );

  const openPlayer = useCallback(() => setPlayerOpen(true), []);
  const closePlayer = useCallback(() => setPlayerOpen(false), []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLiked,
        isShuffle,
        repeatMode,
        progress,
        volume,
        playerOpen,
        queue,
        playTrack,
        togglePlay,
        skipNext,
        skipPrev,
        cycleRepeat,
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

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx)
    throw new Error(
      "usePlayer muss innerhalb von <PlayerProvider> verwendet werden",
    );
  return ctx;
};
