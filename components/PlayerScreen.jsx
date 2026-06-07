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
import { useCallback, useEffect, useRef, useState } from "react";
import Slider from "@react-native-community/slider";
import { usePlayer } from "../context/PlayerContext";
import { Ionicons } from "@expo/vector-icons";
import ArtistList from "./ArtistList";
import { Colors } from "../constants/Colors";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import MutedText from "./MutedText";
import { RepeatMode, useActiveMediaItem, useProgress } from "@rntp/player";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

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

/** Fortschrittsbalken + Seek mit Slider */
const ProgressBar = ({ progress, duration, onSeek }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const elapsed = progress || 0;
  const totalDuration = duration || 0;
  const currentValue = isDragging ? dragValue : totalDuration > 0 ? elapsed : 0;

  const handleSliderChange = useCallback(
    (value) => {
      setDragValue(value);
      if (totalDuration > 0) {
        onSeek(value / totalDuration);
      }
    },
    [totalDuration, onSeek],
  );

  return (
    <ThemedView
      style={{
        marginBottom: 28,
        gap: 10,
      }}
    >
      <Slider
        style={{ height: 40, width: "100%" }}
        minimumValue={0}
        maximumValue={totalDuration}
        value={currentValue}
        onValueChange={handleSliderChange}
        onSlidingStart={() => setIsDragging(true)}
        onSlidingComplete={() => setIsDragging(false)}
        minimumTrackTintColor={theme.ACCENT}
        maximumTrackTintColor={theme.SURFACE3}
        thumbTintColor={theme.TEXT}
        step={0.1}
      />
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText
          style={{
            fontSize: 11,
            color: theme.DIM,
            fontVariant: ["tabular-nums"],
          }}
        >
          {formatTime(isDragging ? dragValue : elapsed)}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 11,
            color: theme.DIM,
            fontVariant: ["tabular-nums"],
          }}
        >
          -{formatTime(totalDuration - (isDragging ? dragValue : elapsed))}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const PlayerScreen = () => {
  const {
    currentTrack,
    isPlaying,
    isLiked,
    isShuffle,
    repeatMode,
    volume,
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
  } = usePlayer();

  // Verwende den nativen Hook für zuverlässiges Track-Updates
  const activeMediaItem = useActiveMediaItem();
  const { position, duration, buffered, cached } = useProgress(0.3);

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

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  var mode = repeatMode;

  const toggleRepeatMode = () => {
    if (repeatMode === RepeatMode.Off) {
      setPlayerRepeatMode(RepeatMode.One);
    } else if (repeatMode === RepeatMode.One) {
      setPlayerRepeatMode(RepeatMode.All);
    } else {
      setPlayerRepeatMode(RepeatMode.Off);
    }
  };

  useEffect(() => {
    console.log("Progress:", position);
  }, [position]);

  return (
    <Modal
      visible={playerOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closePlayer}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.BG }}>
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
                  backgroundColor: theme.SURFACE3,
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
                  color={theme.MUTED}
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
                    color: theme.MUTED,
                    textTransform: "uppercase",
                  }}
                >
                  Grade läuft
                </ThemedText>
                <ThemedText>Album</ThemedText>
              </ThemedView>
              <TouchableOpacity activeOpacity={0.6}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={theme.MUTED}
                />
              </TouchableOpacity>
            </ThemedView>

            {/* ── Artwork ── */}
            <ThemedView
              style={{
                alignItems: "center",
                marginVertical: 24,
              }}
            >
              <Artwork color2={"theme.SURFACE3"} isPlaying={isPlaying} />
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
                  }}
                  numberOfLines={1}
                >
                  {activeMediaItem?.title || "Unbekannter Titel"}
                </ThemedText>
                <MutedText
                  style={{
                    fontSize: 16,
                  }}
                  numberOfLines={1}
                >
                  {activeMediaItem?.artist || "Unbekannter Künstler"}
                </MutedText>
              </ThemedView>
              <TouchableOpacity
                onPress={() => setIsLiked((v) => !v)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={isLiked ? theme.ACCENT : theme.MUTED}
                />
              </TouchableOpacity>
            </ThemedView>

            {/* ── Progress ── */}
            <ProgressBar
              progress={position}
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
                onPress={() => setShuffleEnabled(!isShuffle)}
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
                  color={isShuffle ? theme.ACCENT : theme.MUTED}
                />
              </TouchableOpacity>

              {/* Zurück */}
              <TouchableOpacity
                onPress={skipPrevious}
                activeOpacity={0.6}
                style={{
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="play-skip-back" size={24} color={theme.MUTED} />
              </TouchableOpacity>

              {/* Play / Pause */}
              {isPlaying ? (
                <Ionicons
                  name="pause-circle"
                  size={80}
                  color={theme.ACCENT}
                  onPress={pause}
                  style={{
                    shadowColor: theme.ACCENT,
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
                  onPress={play}
                  style={{
                    shadowColor: theme.ACCENT,
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
                <Ionicons
                  name="play-skip-forward"
                  size={24}
                  color={theme.MUTED}
                />
              </TouchableOpacity>

              {/* Repeat */}
              <TouchableOpacity
                onPress={toggleRepeatMode}
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
                    color: mode === "off" ? theme.DIM : theme.ACCENT,
                    letterSpacing: 0.5,
                  }}
                >
                  {mode === "one" ? "1×" : "↺"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* ── Volume ── */}
            {/* 
            <ThemedView
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 32,
              }}
            >
              <Ionicons name="volume-low" size={20} color={theme.MUTED} />
              <Pressable
                style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: theme.S3,
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
                      backgroundColor: theme.MUTED,
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
                      backgroundColor: theme.TEXT,
                    }}
                  />
                </ThemedView>
              </Pressable>
              <Ionicons name="volume-medium" size={20} color={theme.MUTED} />
            </ThemedView> */}

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
                  backgroundColor: theme.SURFACE2,
                }}
                activeOpacity={0.6}
              >
                <ThemedText
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: theme.MUTED,
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
                  backgroundColor: theme.SURFACE2,
                }}
                activeOpacity={0.6}
                onPress={() =>
                  activeMediaItem &&
                  Share.share({
                    message: `${activeMediaItem.title || "Unknown"} von ${activeMediaItem.artist || "Unknown Artist"}`,
                    url: activeMediaItem.url || "",
                    title: activeMediaItem.title || "Unknown",
                  })
                }
              >
                <ThemedText
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: theme.MUTED,
                  }}
                >
                  Teilen
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* Künstler Info */}
            <ArtistList
              artist={activeMediaItem?.artist}
              style={{ marginTop: 30, marginBottom: 40 }}
            />

            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.TEXT,
                marginBottom: 16,
              }}
              onPress={() => console.log(repeatMode)}
            >
              Nächste Titel
            </ThemedText>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

export default PlayerScreen;
