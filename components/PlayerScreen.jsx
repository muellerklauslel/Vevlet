import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Share,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useCallback, useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";
import { Ionicons } from "@expo/vector-icons";
import ArtistList from "./ArtistList";
import { Colors } from "../constants/Colors";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import MutedText from "./MutedText";

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

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

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
      style={[
        {
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
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <ThemedView
        style={[
          {
            flex: 1,
            borderRadius: 24,
          },
          { backgroundColor: theme.ACCENT },
        ]}
      />
    </Animated.View>
  );
};

/** Fortschrittsbalken + Seek */
const ProgressBar = ({ progress, duration, onSeek }) => {
  const barRef = useRef(null);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

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
    <ThemedView
      style={{
        marginBottom: 28,
        gap: 8,
      }}
    >
      <Pressable
        ref={barRef}
        style={{
          height: 4,
          backgroundColor: theme.SURFACE3,
          borderRadius: 2,
        }}
        onPress={handlePress}
      >
        <ThemedView
          style={[
            {
              height: "100%",
              backgroundColor: theme.ACCENT,
              borderRadius: 2,
              position: "relative",
            },
            { width: `${progress * 100}%` },
          ]}
        >
          <ThemedView
            style={{
              position: "absolute",
              right: -6,
              top: -4,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: theme.TEXT,
            }}
          />
        </ThemedView>
      </Pressable>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText
          style={{
            fontSize: 11,
            color: DIM,
            fontVariant: ["tabular-nums"],
          }}
        >
          {formatTime(elapsed)}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 11,
            color: DIM,
            fontVariant: ["tabular-nums"],
          }}
        >
          -{formatTime(remaining)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

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

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  var mode = repeatMode;

  return (
    <Modal
      visible={playerOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closePlayer}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: theme.BG,
            paddingHorizontal: 24,
          },
          { transform: [{ translateY }] },
        ]}
      >
        <ScrollView
          style={{ margin: 0, padding: 0 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Drag Handle ── */}
          <ThemedView
            {...panResponder.panHandlers}
            style={{
              alignItems: "center",
              paddingTop: 12,
              paddingBottom: 4,
            }}
          >
            <ThemedView
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: S3,
              }}
            />
          </ThemedView>

          {/* ── Topbar ── */}
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
            }}
          >
            <TouchableOpacity
              onPress={closePlayer}
              style={{
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.6}
            >
              <Ionicons
                name="chevron-down"
                size={24}
                color={MUTED}
                style={{ marginTop: -6 }}
              />
            </TouchableOpacity>
            <ThemedView
              style={{
                flex: 1,
                alignItems: "center",
                gap: 2,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  letterSpacing: 0.8,
                  color: MUTED,
                  textTransform: "uppercase",
                }}
              >
                Grade läuft
              </ThemedText>
            </ThemedView>
            <TouchableOpacity activeOpacity={0.6}>
              <Ionicons name="ellipsis-vertical" size={20} color={MUTED} />
            </TouchableOpacity>
          </ThemedView>

          {/* ── Artwork ── */}
          <ThemedView
            style={{
              alignItems: "center",
              marginVertical: 24,
            }}
          >
            <Artwork color2={currentTrack.color2} isPlaying={isPlaying} />
          </ThemedView>

          {/* ── Meta + Like ── */}
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <ThemedView
              style={{
                flex: 1,
                gap: 4,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 22,
                  fontWeight: "600",
                  color: TEXT,
                }}
                numberOfLines={1}
              >
                {currentTrack.title || "Unbekannter Titel"}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 16,
                  color: MUTED,
                }}
                numberOfLines={1}
              >
                {currentTrack.artist || "Unbekannter Künstler"}
              </ThemedText>
            </ThemedView>
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
          </ThemedView>

          {/* ── Progress ── */}
          <ProgressBar
            progress={progress}
            duration={duration}
            onSeek={seekTo}
          />

          {/* ── Controls ── */}
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 36,
            }}
          >
            {/* Shuffle */}
            <TouchableOpacity
              onPress={() => setIsShuffle((v) => !v)}
              activeOpacity={0.6}
              style={{
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="shuffle"
                size={24}
                color={isShuffle ? ACCENT : MUTED}
              />
            </TouchableOpacity>

            {/* Zurück */}
            <TouchableOpacity
              onPress={skipPrev}
              activeOpacity={0.6}
              style={{
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play-skip-back" size={24} color={MUTED} />
            </TouchableOpacity>

            {/* Play / Pause */}
            {isPlaying ? (
              <Ionicons
                name="pause-circle"
                size={80}
                color={theme.ACCENT}
                onPress={togglePlay}
                style={{
                  shadowColor: ACCENT,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              />
            ) : (
              <Ionicons
                name="play-circle"
                size={80}
                color={theme.ACCENT}
                onPress={togglePlay}
                style={{
                  shadowColor: ACCENT,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              />
            )}

            {/* Vor */}
            <TouchableOpacity
              onPress={skipNext}
              activeOpacity={0.6}
              style={{
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play-skip-forward" size={24} color={MUTED} />
            </TouchableOpacity>

            {/* Repeat */}
            <TouchableOpacity
              onPress={cycleRepeat}
              activeOpacity={0.6}
              style={{
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText
                style={{
                  fontSize: 24,
                  fontFamily: "System",
                  fontWeight: "400",
                  color: mode === "off" ? DIM : ACCENT,
                  letterSpacing: 0.5,
                }}
              >
                {mode === "one" ? "1×" : "↺"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* ── Volume ── */}
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            {/* Lautsprecher min */}
            <Ionicons name="volume-low" size={20} color={MUTED} />
            <Pressable
              style={{
                flex: 1,
                height: 4,
                backgroundColor: S3,
                borderRadius: 2,
              }}
              onPress={(e) => {
                const ratio =
                  e.nativeEvent.locationX / (SCREEN_W - 48 - 28 - 28);
                setVolume(Math.max(0, Math.min(1, ratio)));
              }}
            >
              <ThemedView
                style={[
                  {
                    height: "100%",
                    backgroundColor: MUTED,
                    borderRadius: 2,
                    position: "relative",
                  },
                  { width: `${volume * 100}%` },
                ]}
              >
                <ThemedView
                  style={{
                    position: "absolute",
                    right: -5,
                    top: -3,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: TEXT,
                  }}
                />
              </ThemedView>
            </Pressable>
            {/* Lautsprecher max */}
            <Ionicons name="volume-medium" size={20} color={MUTED} />
          </ThemedView>

          {/* ── Bottom Actions ── */}
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: S2,
              }}
              activeOpacity={0.6}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: MUTED,
                }}
              >
                Zur Warteschlange
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: S2,
              }}
              activeOpacity={0.6}
              onPress={() =>
                Share.share({
                  message: `${currentTrack.title} von ${currentTrack.artist}`,
                  url: currentTrack.url,
                  title: currentTrack.title,
                })
              }
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: MUTED,
                }}
              >
                Teilen
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

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
