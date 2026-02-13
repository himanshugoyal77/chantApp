// Global Audio Manager - ensures only one audio plays at a time
class AudioManager {
  constructor() {
    this.currentAudio = null;
  }

  play(audioElement) {
    // Stop any currently playing audio
    if (this.currentAudio && this.currentAudio !== audioElement) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    
    // Set the new audio as current
    this.currentAudio = audioElement;
    
    // Play the audio
    if (audioElement) {
      audioElement.play().catch(e => console.log("Audio play error:", e));
    }
  }

  stop(audioElement) {
    if (this.currentAudio === audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      this.currentAudio = null;
    }
  }

  stopAll() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }
}

// Create a singleton instance
export const audioManager = new AudioManager();
