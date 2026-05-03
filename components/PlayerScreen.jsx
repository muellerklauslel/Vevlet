import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";
import { Ionicons } from "@expo/vector-icons";
import ArtistList from "./ArtistList";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// ── Farben ──────────────────────────────────────────────────────────
const ACCENT = "#c9a96e";
const BG = "#0a0a0f";
const S2 = "#1c1c26";
const S3 = "#242432";
const TEXT = "#f0eeea";
const MUTED = "#8a8a9a";
const DIM = "#4a4a5a";

// ── Hilfsfunktionen ─────────────────────────────────────────────────
const formatTime = (seconds) => {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// ── Subkomponenten ───────────────────────────────────────────────────

/** Animiertes Artwork mit Pulsieren wenn playing */
const Artwork = ({ color2, isPlaying }) => {
  const scaleAnim = useRef(new Animated.Value(isPlaying ? 1 : 0.88)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isPlaying ? 1 : 0.88,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [isPlaying]);

  return (
    <Animated.View
      style={[styles.artwork, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={[styles.artworkInner, { backgroundColor: color2 }]} />
    </Animated.View>
  );
};

/** Fortschrittsbalken + Seek */
const ProgressBar = ({ progress, duration, onSeek }) => {
  const barRef = useRef(null);

  const handlePress = useCallback(
    (e) => {
      if (!barRef.current) return;
      barRef.current.measure((x, y, width) => {
        const ratio = e.nativeEvent.locationX / width;
        onSeek(Math.max(0, Math.min(1, ratio)));
      });
    },
    [onSeek],
  );

  const elapsed = progress * duration;
  const remaining = duration - elapsed;

  return (
    <View style={styles.progressSection}>
      <Pressable
        ref={barRef}
        style={styles.progressTrack}
        onPress={handlePress}
      >
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]}>
          <View style={styles.progressThumb} />
        </View>
      </Pressable>
      <View style={styles.progressTimes}>
        <Text style={styles.timeText}>{formatTime(elapsed)}</Text>
        <Text style={styles.timeText}>−{formatTime(remaining)}</Text>
      </View>
    </View>
  );
};

/** Icon-Button (generisch) */
const IconBtn = ({ onPress, children, size = 44, accent = false }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.6}
    style={[
      styles.iconBtn,
      { width: size, height: size, borderRadius: size / 2 },
      accent && styles.iconBtnAccent,
    ]}
  >
    {children}
  </TouchableOpacity>
);

/** Play/Pause-Button */
const PlayPauseBtn = ({ isPlaying, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={styles.playPauseBtn}
  >
    {isPlaying ? (
      <View style={styles.pauseIcon}>
        <View style={styles.pauseBar} />
        <View style={styles.pauseBar} />
      </View>
    ) : (
      <View style={styles.playIcon} />
    )}
  </TouchableOpacity>
);

/** Shuffle-Icon */
const ShuffleIcon = ({ active }) => (
  <View style={{ gap: 3 }}>
    <View
      style={[
        styles.shuffleLine,
        { width: 14 },
        active && { backgroundColor: ACCENT },
      ]}
    />
    <View
      style={[
        styles.shuffleLine,
        { width: 10 },
        active && { backgroundColor: ACCENT },
      ]}
    />
  </View>
);

/** Repeat-Icon-Text */
const RepeatLabel = ({ mode }) => {
  const color = mode === "off" ? DIM : ACCENT;
  return (
    <Text
      style={{ fontSize: 10, fontWeight: "700", color, letterSpacing: 0.5 }}
    >
      {mode === "one" ? "1×" : "↺"}
    </Text>
  );
};

// ── Hauptkomponente ──────────────────────────────────────────────────
const PlayerScreen = () => {
  const {
    playerOpen,
    closePlayer,
    currentTrack,
    isPlaying,
    isLiked,
    isShuffle,
    repeatMode,
    progress,
    volume,
    togglePlay,
    skipNext,
    skipPrev,
    cycleRepeat,
    seekTo,
    setVolume,
    setIsLiked,
    setIsShuffle,
  } = usePlayer();

  // ── Slide-down zum Schließen (PanResponder) ───────────────────────
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 0.8) {
          Animated.timing(translateY, {
            toValue: SCREEN_H,
            duration: 250,
            useNativeDriver: true,
          }).start(closePlayer);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 12,
          }).start();
        }
      },
    }),
  ).current;

  // translateY zurücksetzen wenn Modal öffnet
  useEffect(() => {
    if (playerOpen) translateY.setValue(0);
  }, [playerOpen]);

  const duration = currentTrack.duration || 240;

  return (
    <Modal
      visible={playerOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closePlayer}
    >
      <Animated.View style={[styles.root, { transform: [{ translateY }] }]}>
        <ScrollView
          style={{ margin: 0, padding: 0 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Drag Handle ── */}
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          {/* ── Topbar ── */}
          <View style={styles.topbar}>
            <TouchableOpacity
              onPress={closePlayer}
              style={styles.closeBtn}
              activeOpacity={0.6}
            >
              <View style={styles.chevronDown} />
            </TouchableOpacity>
            <View style={styles.topbarCenter}>
              <Text style={styles.topbarLabel}>Grade läuft</Text>
            </View>
            <TouchableOpacity style={styles.moreBtn} activeOpacity={0.6}>
              <Ionicons name="ellipsis-vertical" size={20} color={MUTED} />
            </TouchableOpacity>
          </View>

          {/* ── Artwork ── */}
          <View style={styles.artworkSection}>
            <Artwork color2={currentTrack.color2} isPlaying={isPlaying} />
          </View>

          {/* ── Meta + Like ── */}
          <View style={styles.metaRow}>
            <View style={styles.metaText}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {currentTrack.title || "Unbekannter Titel"}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {currentTrack.artist || "Unbekannter Künstler"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsLiked((v) => !v)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? ACCENT : MUTED}
              />
            </TouchableOpacity>
          </View>

          {/* ── Progress ── */}
          <ProgressBar
            progress={progress}
            duration={duration}
            onSeek={seekTo}
          />

          {/* ── Controls ── */}
          <View style={styles.controls}>
            {/* Shuffle */}
            <TouchableOpacity
              onPress={() => setIsShuffle((v) => !v)}
              activeOpacity={0.6}
              style={styles.sideBtn}
            >
              <ShuffleIcon active={isShuffle} />
            </TouchableOpacity>

            {/* Zurück */}
            <TouchableOpacity
              onPress={skipPrev}
              activeOpacity={0.6}
              style={styles.sideBtn}
            >
              <View style={styles.skipPrevIcon}>
                <View style={styles.skipBar} />
                <View
                  style={[styles.skipTriangle, { transform: [{ scaleX: -1 }] }]}
                />
              </View>
            </TouchableOpacity>

            {/* Play / Pause */}
            <PlayPauseBtn isPlaying={isPlaying} onPress={togglePlay} />

            {/* Vor */}
            <TouchableOpacity
              onPress={skipNext}
              activeOpacity={0.6}
              style={styles.sideBtn}
            >
              <View style={styles.skipNextIcon}>
                <View style={styles.skipTriangle} />
                <View style={styles.skipBar} />
              </View>
            </TouchableOpacity>

            {/* Repeat */}
            <TouchableOpacity
              onPress={cycleRepeat}
              activeOpacity={0.6}
              style={styles.sideBtn}
            >
              <RepeatLabel mode={repeatMode} />
            </TouchableOpacity>
          </View>

          {/* ── Volume ── */}
          <View style={styles.volumeRow}>
            {/* Lautsprecher min */}
            <Ionicons name="volume-low" size={20} color={MUTED} />
            <Pressable
              style={styles.volumeTrack}
              onPress={(e) => {
                const ratio =
                  e.nativeEvent.locationX / (SCREEN_W - 48 - 28 - 28);
                setVolume(Math.max(0, Math.min(1, ratio)));
              }}
            >
              <View style={[styles.volumeFill, { width: `${volume * 100}%` }]}>
                <View style={styles.volumeThumb} />
              </View>
            </Pressable>
            {/* Lautsprecher max */}
            <Ionicons name="volume-medium" size={20} color={MUTED} />
          </View>

          {/* ── Bottom Actions ── */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6}>
              <Text style={styles.actionLabel}>Zur Warteschlange</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.6}
              onPress={() =>
                Share.share({
                  message: `${currentTrack.title} von ${currentTrack.artist}`,
                  url: currentTrack.url,
                  title: currentTrack.title,
                })
              }
            >
              <Text style={styles.actionLabel}>Teilen</Text>
            </TouchableOpacity>
          </View>

          {/* Künstler Info */}
          <ArtistList
            artist={currentTrack.artist}
            style={{ marginTop: 30, marginBottom: 40 }}
          />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default PlayerScreen;

// ── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
  },

  // Handle
  handleArea: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: S3,
  },

  // Topbar
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronDown: {
    width: 18,
    height: 18,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: MUTED,
    transform: [{ rotate: "45deg" }],
    marginTop: -6,
  },
  topbarCenter: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  topbarLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: MUTED,
    textTransform: "uppercase",
  },
  topbarAlbum: {
    fontSize: 13,
    fontWeight: "500",
    color: TEXT,
  },
  moreBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  dotRow: {
    flexDirection: "column",
    gap: 3,
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: MUTED,
  },

  // Artwork
  artworkSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  artwork: {
    width: SCREEN_W - 80,
    height: SCREEN_W - 80,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  artworkInner: {
    flex: 1,
    borderRadius: 24,
  },

  // Meta
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  metaText: {
    flex: 1,
    gap: 4,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: TEXT,
  },
  trackArtist: {
    fontSize: 15,
    color: MUTED,
  },

  // Heart (via Shapes)
  heartIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.4,
  },
  heartIconActive: {
    opacity: 1,
  },
  heartLeft: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: ACCENT,
    top: 4,
    left: 4,
  },
  heartRight: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: ACCENT,
    top: 4,
    right: 4,
  },
  heartBottom: {
    position: "absolute",
    bottom: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: ACCENT,
  },

  // Progress
  progressSection: {
    marginBottom: 28,
    gap: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: S3,
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: ACCENT,
    borderRadius: 2,
    position: "relative",
  },
  progressThumb: {
    position: "absolute",
    right: -6,
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: TEXT,
  },
  progressTimes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 11,
    color: DIM,
    fontVariant: ["tabular-nums"],
  },

  // Controls
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  sideBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  playPauseBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  pauseIcon: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  pauseBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: BG,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: BG,
    marginLeft: 4,
  },

  // Skip Icons
  skipNextIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  skipPrevIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  skipTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: TEXT,
  },
  skipBar: {
    width: 3,
    height: 15,
    borderRadius: 1.5,
    backgroundColor: TEXT,
  },

  // Shuffle
  shuffleLine: {
    height: 2,
    borderRadius: 1,
    backgroundColor: DIM,
  },

  // Volume
  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  volIcon: {
    width: 16,
    height: 12,
    borderLeftWidth: 4,
    borderLeftColor: DIM,
    borderTopWidth: 4,
    borderTopColor: "transparent",
    borderBottomWidth: 4,
    borderBottomColor: "transparent",
  },
  volIconMax: {
    borderRightWidth: 3,
    borderRightColor: DIM,
  },
  volumeTrack: {
    flex: 1,
    height: 4,
    backgroundColor: S3,
    borderRadius: 2,
  },
  volumeFill: {
    height: "100%",
    backgroundColor: MUTED,
    borderRadius: 2,
    position: "relative",
  },
  volumeThumb: {
    position: "absolute",
    right: -5,
    top: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: TEXT,
  },

  // Bottom
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: S2,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: MUTED,
  },

  // Generic
  iconBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnAccent: {
    backgroundColor: ACCENT,
  },
});
