import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
} from "react-native-track-player";

/**
 * Background Task Handler für TrackPlayer
 * Wird registriert mit TrackPlayer.registerPlaybackService()
 * Verarbeitet Media Control Events auch wenn die App im Hintergrund läuft
 */
export async function trackPlayerBackground() {
  // Player wurde initialisiert
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    try {
      const currentIndex = await TrackPlayer.getCurrentTrack();
      if (currentIndex !== null) {
        await TrackPlayer.skipToNext();
      }
    } catch (error) {
      console.error("Fehler beim Skip Next:", error);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    try {
      const currentIndex = await TrackPlayer.getCurrentTrack();
      if (currentIndex !== null) {
        const position = await TrackPlayer.getPosition();
        // Wenn > 3 Sekunden gespielt, von vorne starten, sonst vorheriger Track
        if (position > 3) {
          await TrackPlayer.seekTo(0);
        } else {
          await TrackPlayer.skipToPrevious();
        }
      }
    } catch (error) {
      console.error("Fehler beim Skip Previous:", error);
    }
  });

  // Reagiert auf Remote Control Skip-Gesten (z.B. Headphone-Buttons)
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    TrackPlayer.seekTo(position);
  });

  // Stop-Button
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  // Jump Forward (z.B. 15 Sekunden)
  TrackPlayer.addEventListener(
    Event.RemoteJumpForward,
    async ({ interval }) => {
      try {
        const position = await TrackPlayer.getPosition();
        await TrackPlayer.seekTo(position + interval);
      } catch (error) {
        console.error("Fehler beim Jump Forward:", error);
      }
    },
  );

  // Jump Backward (z.B. 15 Sekunden zurück)
  TrackPlayer.addEventListener(
    Event.RemoteJumpBackward,
    async ({ interval }) => {
      try {
        const position = await TrackPlayer.getPosition();
        const newPosition = Math.max(0, position - interval);
        await TrackPlayer.seekTo(newPosition);
      } catch (error) {
        console.error("Fehler beim Jump Backward:", error);
      }
    },
  );

  // Like Button
  TrackPlayer.addEventListener(Event.RemoteLike, async () => {
    try {
      const track = await TrackPlayer.getActiveTrack();
      if (track) {
        console.log("Track geliked:", track.id);
        // Hier könnten Sie einen API-Call machen um den Track zu speichern
      }
    } catch (error) {
      console.error("Fehler beim Like Track:", error);
    }
  });
}
