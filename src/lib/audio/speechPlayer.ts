import { PRELOADED_AUDIO_MAP } from "./preloadedAudioMap";

export const PRIMARY_VOICE_ID =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["VITE_ELEVENLABS_VOICE_ID"]) ||
  "jP6rT0U10vfyLbGW2Wm8"; // Anuj (Indian Accent)

export const FALLBACK_VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel (Premade Educator)

class SpeechPlayerManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onEndCallbacks: Set<() => void> = new Set();
  private isSpeakingState = false;
  private watchdogTimer: ReturnType<typeof setTimeout> | null = null;
  private activeSessionId = 0;

  public get isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  /**
   * Plays speech for a given chapter, page, and line with strict anti-overlap session locking.
   */
  public async playSpokenLine(options: {
    text: string;
    chapterId?: string;
    pageNumber?: number;
    lineIndex?: number;
    onEnd?: () => void;
  }): Promise<void> {
    const sessionId = ++this.activeSessionId;
    this.stopAllInternal();
    this.isSpeakingState = true;

    if (options.onEnd) {
      this.onEndCallbacks.add(options.onEnd);
    }

    // 1. Check Preloaded Static Audio Map
    const key = `${options.chapterId || ""}-p${options.pageNumber ?? 1}-l${options.lineIndex ?? 0}`;
    const preloadedUrl = PRELOADED_AUDIO_MAP[key];

    if (preloadedUrl) {
      const played = await this.tryPlayAudioUrl(preloadedUrl, sessionId);
      if (played) return;
    }

    if (this.activeSessionId !== sessionId) return;

    // 2. Fall back to Dynamic ElevenLabs / Web Speech
    await this.playDynamicSpeechInternal(options.text, sessionId);
  }

  /**
   * Plays dynamic speech (e.g. for student AI chat replies or custom generated slides)
   */
  public async playDynamicSpeech(text: string, onEnd?: () => void): Promise<void> {
    const sessionId = ++this.activeSessionId;
    this.stopAllInternal();
    this.isSpeakingState = true;
    if (onEnd) {
      this.onEndCallbacks.add(onEnd);
    }
    await this.playDynamicSpeechInternal(text, sessionId);
  }

  private async tryPlayAudioUrl(url: string, sessionId: number): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.activeSessionId !== sessionId) {
        resolve(false);
        return;
      }

      const audio = new Audio(url);
      this.currentAudio = audio;
      let resolved = false;

      audio.oncanplaythrough = async () => {
        if (resolved) return;
        if (this.activeSessionId !== sessionId) {
          audio.pause();
          audio.src = "";
          resolve(false);
          return;
        }

        try {
          await audio.play();
          audio.onended = () => {
            if (this.activeSessionId === sessionId) {
              this.handlePlaybackEnded();
            }
          };
          resolve(true);
        } catch {
          resolve(false);
        }
      };

      audio.onerror = () => {
        if (!resolved) {
          resolved = true;
          resolve(false);
        }
      };

      setTimeout(() => {
        if (!resolved && audio.readyState < 2) {
          resolved = true;
          resolve(false);
        }
      }, 1500);
    });
  }

  private async playDynamicSpeechInternal(text: string, sessionId: number): Promise<void> {
    const apiKey =
      (typeof import.meta !== "undefined" && import.meta.env && import.meta.env["VITE_ELEVENLABS_API_KEY"]) ||
      "";

    if (apiKey && this.activeSessionId === sessionId) {
      // 1. Try primary voice ID
      let blob = await this.fetchElevenLabsAudio(text, PRIMARY_VOICE_ID, apiKey);

      // 2. If primary fails (e.g. library voice requiring paid tier), fallback to premade voice
      if (!blob && PRIMARY_VOICE_ID !== FALLBACK_VOICE_ID && this.activeSessionId === sessionId) {
        blob = await this.fetchElevenLabsAudio(text, FALLBACK_VOICE_ID, apiKey);
      }

      if (blob && this.activeSessionId === sessionId) {
        const audioUrl = URL.createObjectURL(blob);
        const played = await this.tryPlayAudioUrl(audioUrl, sessionId);
        if (played) return;
      }
    }

    if (this.activeSessionId === sessionId) {
      // 3. Fallback to Web Speech Synthesis
      this.playBrowserSpeech(text, sessionId);
    }
  }

  private async fetchElevenLabsAudio(text: string, voiceId: string, apiKey: string): Promise<Blob | null> {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (res.ok) {
        return await res.blob();
      }
    } catch (err) {
      console.warn(`ElevenLabs TTS call failed for ${voiceId}:`, err);
    }
    return null;
  }

  private playBrowserSpeech(text: string, sessionId: number) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.handlePlaybackEnded();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(
      (v) =>
        v.lang.includes("en-IN") ||
        v.name.toLowerCase().includes("india") ||
        v.name.toLowerCase().includes("ravi") ||
        v.name.toLowerCase().includes("neerja") ||
        v.name.toLowerCase().includes("natural")
    );
    if (indianVoice) utterance.voice = indianVoice;

    this.currentUtterance = utterance;

    utterance.onend = () => {
      if (this.activeSessionId === sessionId) {
        this.handlePlaybackEnded();
      }
    };

    utterance.onerror = () => {
      if (this.activeSessionId === sessionId) {
        this.handlePlaybackEnded();
      }
    };

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const durationMs = Math.max(2500, wordCount * 330 + 1000);

    this.watchdogTimer = setTimeout(() => {
      if (this.isSpeakingState && this.activeSessionId === sessionId) {
        this.handlePlaybackEnded();
      }
    }, durationMs + 2000);

    window.speechSynthesis.speak(utterance);
  }

  private handlePlaybackEnded() {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    this.isSpeakingState = false;
    const callbacks = Array.from(this.onEndCallbacks);
    this.onEndCallbacks.clear();
    callbacks.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error("Error in speech onEnd callback:", err);
      }
    });
  }

  private stopAllInternal() {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    this.isSpeakingState = false;

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = "";
      } catch {}
      this.currentAudio = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.currentUtterance = null;
    }
    this.onEndCallbacks.clear();
  }

  /**
   * Instantly pauses and cancels any active speaking audio.
   */
  public stopAll() {
    this.activeSessionId++;
    this.stopAllInternal();
  }
}

export const speechPlayer = new SpeechPlayerManager();
