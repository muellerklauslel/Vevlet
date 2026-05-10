# React Native Track Player Integration Guide

## ✅ Setup Abgeschlossen

Dein Projekt ist jetzt mit `react-native-track-player` konfiguriert und bereit für die Entwicklung!

## 📋 Was wurde gemacht:

1. **Pakete installiert**
   - `react-native-track-player` ✅
   - Alle Abhängigkeiten gebaut

2. **Native Projekte erstellt** (`expo prebuild`)
   - ✅ Android Projekt `/android`
   - ✅ iOS Projekt `/ios`

3. **app.json konfiguriert**
   - ✅ `newArchEnabled: false` (notwendig für TrackPlayer)
   - ✅ Android Permissions für Audio-Playback
   - ✅ iOS Background Audio Mode

4. **PlayerContext aktualisiert**
   - ✅ Integration mit TrackPlayer
   - ✅ Real-time Progress Tracking
   - ✅ Shuffle, Repeat, Volume Control

5. **Services erstellt**
   - ✅ `services/trackPlayerService.js` - Utility-Funktionen für TrackPlayer

## 🚀 Verwendung

### Track abspielen

```javascript
import { usePlayer } from "../context/PlayerContext";

export default function MyComponent() {
  const { playTrack } = usePlayer();

  const handlePlayTrack = () => {
    const track = {
      id: "1",
      title: "Lied Name",
      artist: "Künstler",
      album: "Album Name",
      url: "https://example.com/song.mp3",
      duration: 180, // Sekunden
      artwork: "https://example.com/cover.jpg",
    };

    playTrack(track);
  };

  return <Button onPress={handlePlayTrack} title="Play" />;
}
```

### Queue abspielen

```javascript
const { playTrack } = usePlayer();

const tracks = [
  { id: "1", title: "Song 1", artist: "Artist", url: "..." },
  { id: "2", title: "Song 2", artist: "Artist", url: "..." },
];

// Spiele die Queue ab, starte bei Track 0
playTrack(tracks[0], tracks);
```

### Player Controls

```javascript
const {
  togglePlay, // Play/Pause umschalten
  skipNext, // Nächster Track
  skipPrev, // Vorheriger Track
  seekTo, // Zu Position springen (0-1)
  setVolume, // Lautstärke (0-1)
  setIsShuffle, // Shuffle an/aus
  cycleRepeat, // Repeat-Modus wechseln
} = usePlayer();

togglePlay();
skipNext();
seekTo(0.5); // Springe zur Mitte des Tracks
setVolume(0.8);
```

### Player State

```javascript
const {
  currentTrack, // Aktueller Track
  isPlaying, // Boolean
  progress, // 0-1 (Prozent)
  progressPosition, // Aktuelle Position (Sekunden)
  progressDuration, // Gesamtdauer (Sekunden)
  queue, // Array von Tracks
  queueIndex, // Aktueller Index in der Queue
  repeatMode, // "off", "all", oder "one"
  isShuffle, // Boolean
  volume, // 0-1
} = usePlayer();
```

## 📱 Android Development

Zum Testen auf Android:

```bash
cd /home/tim/Schreibtisch/Projekte/VS\ Code/Vevlet
npm run android
```

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
