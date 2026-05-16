# React Native Track Player Integration Guide

## ✅ Setup Vollständig Implementiert

Dein Projekt ist nun vollständig mit `react-native-track-player` integriert mit echter Playback-Synchronisation!

## 📦 Was wurde implementiert:

### 1. **App-Konfiguration** (`app.json`)

- ✅ `newArchEnabled: false` - Notwendig für TrackPlayer Kompatibilität
- ✅ iOS Background Audio Mode aktiviert
- ✅ Android Permissions für Audio, Internet, Storage und Foreground Service
- ✅ TrackPlayer Plugin in der Expo-Konfiguration

### 2. **Backend Services** (`services/`)

- ✅ `trackPlayerService.js` - Alle Playback-Funktionen
  - `initializeTrackPlayer()` - Setup mit Background Service
  - `playTrack()` - Einzelnen Track abspielen
  - `togglePlayback()` - Play/Pause
  - `skipToNext()` / `skipToPrevious()` - Navigation
  - `seekTo()` - Zu Position springen
  - `setVolume()` - Lautstärke kontrollieren
  - `cycleRepeatMode()` - Repeat-Modi
  - `getPlaybackState()` - Aktuellen Status abrufen

- ✅ `trackPlayerBackground.js` - Background Event Handler
  - Media Control Button Support (Play, Pause, Next, Prev)
  - Lock Screen Controls
  - Headphone Button Integration
  - Like/Dislike Funktionen

### 3. **State Management** (`context/PlayerContext.jsx`)

- ✅ Vollständig mit TrackPlayer Events synchronisiert
- ✅ Real-time Progress Tracking
- ✅ Playback State Management
- ✅ Queue Management
- ✅ Shuffle & Repeat Modus
- ✅ Error Handling mit Try-Catch

### 4. **App-Initialisierung** (`app/_layout.jsx`)

- ✅ TrackPlayer wird beim App-Start initialisiert
- ✅ Loading-Check für sicheres Startup
- ✅ Error-Resilient Setup

## 🚀 Verwendung

### Basic Track Abspielen

```javascript
import { usePlayer } from "../context/PlayerContext";

export default function MyComponent() {
  const { playTrack } = usePlayer();

  const handlePlayTrack = async () => {
    const track = {
      id: "1",
      title: "Song Title",
      artist: "Artist Name",
      album: "Album Name",
      url: "https://example.com/song.mp3",
      duration: 180, // Sekunden
      artwork: "https://example.com/cover.jpg",
      color1: "#ff5500", // Optional
      color2: "#ffaa00", // Optional
    };

    await playTrack(track);
  };

  return <Button onPress={handlePlayTrack} title="Play" />;
}
```

### Playlist/Queue abspielen

```javascript
const { playTrack, updateQueue } = usePlayer();

const tracks = [
  {
    id: "1",
    title: "Song 1",
    artist: "Artist",
    album: "Album",
    url: "https://...",
    duration: 180,
  },
  {
    id: "2",
    title: "Song 2",
    artist: "Artist",
    album: "Album",
    url: "https://...",
    duration: 200,
  },
];

// Lade die komplette Queue
await updateQueue(tracks);

// Starte die Wiedergabe beim ersten Track
await playTrack(tracks[0], tracks);
```

### Player Controls

```javascript
const {
  togglePlay, // Play/Pause Toggle
  skipNext, // Zum nächsten Track
  skipPrev, // Zum vorherigen Track (oder Track von vorne wenn > 3s)
  seekTo, // Zu Position springen (0-1 ratio)
  setVolume, // Lautstärke (0-1)
  setIsShuffle, // Shuffle an/aus
  cycleRepeat, // Repeat-Modus wechseln (off → all → one)
} = usePlayer();

// Play/Pause
await togglePlay();

// Navigation
await skipNext();
await skipPrev();

// Seeken (z.B. zur Mitte)
await seekTo(0.5);

// Lautstärke
await setVolume(0.8);

// Shuffle
setIsShuffle(true);

// Repeat-Modi
await cycleRepeat(); // off → all
await cycleRepeat(); // all → one
await cycleRepeat(); // one → off
```

### Player State Abfragen

```javascript
const {
  currentTrack, // { id, title, artist, album, duration, ... }
  isPlaying, // Boolean
  progress, // 0-1 (Prozent)
  progressPosition, // Aktuelle Position in Sekunden
  progressDuration, // Gesamtdauer in Sekunden
  queue, // Array von Tracks
  queueIndex, // Index des aktuellen Tracks
  volume, // 0-1
  repeatMode, // "off" | "all" | "one"
  isShuffle, // Boolean
  isInitialized, // TrackPlayer bereit?
} = usePlayer();

// Beispiel: Progress Bar
<Text>
  {Math.floor(progressPosition)}s / {Math.floor(progressDuration)}s
</Text>;
```

### Like/Dislike Tracks

```javascript
const { isLiked, setIsLiked } = usePlayer();

const handleLike = () => {
  setIsLiked(!isLiked);
  // TODO: API Call um Track zu speichern
};

return (
  <TouchableOpacity onPress={handleLike}>
    <Icon name={isLiked ? "heart" : "heart-outline"} />
  </TouchableOpacity>
);
```

### Player UI öffnen/schließen

```javascript
const { openPlayer, closePlayer, playerOpen } = usePlayer();

// Player Modal öffnen
<TouchableOpacity onPress={openPlayer}>
  <Text>Expand Player</Text>
</TouchableOpacity>;
```

## 🔧 Wichtige Details

### Event-Synchronisation

Der PlayerContext hört auf folgende TrackPlayer Events:

- `Event.PlaybackState` - Playback Status ändert sich
- `Event.PlaybackTrackChanged` - Track wechselt
- `Event.PlaybackProgressUpdated` - Progress aktualisiert (50ms Intervall)
- `Event.PlaybackQueueEnded` - Queue beendet

### Background Controls

Die App reagiert auf:

- ✅ Media Control Buttons (Play, Pause, Next, Prev)
- ✅ Lock Screen Controls
- ✅ Headphone Button Events
- ✅ Android Wear / Watch Controls
- ✅ Car Integration (Android Auto, CarPlay)

### Repeat-Modi

- `"off"` - Kein Wiederholen
- `"all"` - Komplette Queue wiederholen
- `"one"` - Einzelner Track wiederholen

### Skip-Vorherigen Logik

- Wenn > 3 Sekunden gespielt: Starte Track von vorne
- Wenn ≤ 3 Sekunden: Gehe zum vorherigen Track

## 📋 Wichtige TrackPlayer Fehlerbehandlung

Der Code hat eingebaut:

- ✅ Try-Catch Blöcke um alle Playback-Operationen
- ✅ Error Logging mit Kontext-Information
- ✅ Graceful Fallbacks
- ✅ Listener Cleanup bei Component Unmount

## 🐛 Debugging

### Logs aktivieren

```javascript
// In trackPlayerService.js
console.log("🎵 Starte TrackPlayer Initialisierung...");
console.log("✅ TrackPlayer erfolgreich initialisiert");
```

### State überprüfen

```javascript
const player = usePlayer();
console.log("Current Track:", player.currentTrack);
console.log("Is Playing:", player.isPlaying);
console.log("Progress:", player.progressPosition / player.progressDuration);
```

## 🚨 Häufige Probleme

### "TrackPlayer not initialized"

→ Stelle sicher, dass `PlayerProvider` um deine App wickelt und warte auf `isInitialized`

### Audio läuft in Simulator nicht

→ Simulatoren haben oft Probleme mit Audio. Teste auf echten Geräten!

### Background Playback funktioniert nicht

→ Stelle sicher, dass `newArchEnabled: false` in app.json ist

### Controls zeigen sich nicht auf Lock Screen

→ Überprüfe dass `trackPlayerBackground.js` korrekt registriert ist
queueIndex, // Aktueller Index in der Queue
repeatMode, // "off", "all", oder "one"
isShuffle, // Boolean
volume, // 0-1
} = usePlayer();

````

## 📱 Android Development

Zum Testen auf Android:

```bash
cd /home/tim/Schreibtisch/Projekte/VS\ Code/Vevlet
npm run android
````

## 🍎 iOS Development

Auf Linux nicht möglich (benötigt macOS). Für iOS verwende EAS Build:

```bash
eas build --platform ios
```

## 🔧 Wichtige Dateien

- `context/PlayerContext.jsx` - Main Player Logic mit TrackPlayer
- `services/trackPlayerService.js` - Utility-Funktionen
- `app.json` - Konfiguration (Permissions, Plugins)
- `android/app/src/main/AndroidManifest.xml` - Android Permissions
- `ios/Vevlet/Info.plist` - iOS Konfiguration (falls iOS Projekt existiert)

## ⚙️ TrackPlayer Dokumentation

Für erweiterte Funktionen siehe:

- https://rntp.dev/
- Events, Queue Management, Playback Events, etc.

## 🐛 Häufige Fehler

**"Player not initialized"**

- Stelle sicher, dass die App in PlayerProvider gerendert wird
- Warte bis `isInitialized === true` bevor du Player-Funktionen aufrufst

**Audio wird nicht wiedergegeben**

- Überprüfe, dass `url` in deinen Tracks gültig ist
- HTTPS URLs werden empfohlen (HTTP kann auf Android/iOS Probleme machen)
- Überprüfe die Konsole auf Fehler-Meldungen

**Lockscreen Controls funktionieren nicht**

- Android: Überprüfe AndroidManifest.xml Permissions
- iOS: Überprüfe Info.plist Background Modes

## 📝 Nächste Schritte

1. Verbinde deine Musik-Daten-Quelle mit dem Player
2. Implementiere UI für Playlists
3. Testen auf Android-Gerät
4. Konfiguriere Lock Screen Artwork und Metadata
