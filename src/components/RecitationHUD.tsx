import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RULES, gradeRecitation, type NcertModule, type RecitationVerdict } from "@/config/rules";
import { AlertIcon, CheckSealIcon, KeyboardIcon, MicIcon, ReplayIcon } from "@/components/icons";

interface Props {
  module: NcertModule;
  /** repeats the teacher recitation of the key concept */
  onReplay: () => void;
  onReadiness: (readiness: number) => void;
}

type Mode = "voice" | "text";

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
}

function getRecognizer(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"]) as
    | (new () => SpeechRecognitionLike)
    | undefined;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = "en-IN";
  rec.interimResults = true;
  rec.continuous = true;
  return rec;
}

/** Active-recall HUD: push-to-talk with waveform + text fallback. */
export function RecitationHUD({ module, onReplay, onReadiness }: Props) {
  const [mode, setMode] = useState<Mode>("voice");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [text, setText] = useState("");
  const [verdict, setVerdict] = useState<RecitationVerdict | null>(null);
  const [attempts, setAttempts] = useState(0);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => () => recRef.current?.stop(), []);

  const evaluate = (said: string) => {
    const v = gradeRecitation(said, module);
    setVerdict(v);
    setAttempts((a) => a + 1);
    onReadiness(v.readiness);
  };

  const startTalking = () => {
    setVerdict(null);
    setTranscript("");
    const rec = getRecognizer();
    setListening(true);
    if (!rec) return; // simulated mode: waveform only, student submits text
    recRef.current = rec;
    rec.onresult = (e) => {
      let out = "";
      for (let i = 0; i < e.results.length; i++) out += ` ${e.results[i]?.[0]?.transcript ?? ""}`;
      setTranscript(out.trim());
    };
    rec.onend = () => setListening(false);
    rec.start();
  };

  const stopTalking = () => {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
    if (transcript.trim()) evaluate(transcript);
    else setMode("text");
  };

  return (
    <div className="rounded-2xl border border-chalk/14 bg-black/25 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/70">Active recall</p>
          <p className="font-[family-name:var(--font-display)] text-lg text-chalk font-medium">Your turn to recite</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReplay}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-md transition-all cursor-pointer"
          >
            <ReplayIcon size={14} /> Teacher repeats ({RULES.teacherRepeats}×)
          </button>
          <button
            onClick={() => setMode(mode === "voice" ? "text" : "voice")}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-md transition-all cursor-pointer"
          >
            {mode === "voice" ? <KeyboardIcon size={14} /> : <MicIcon size={14} />}
            {mode === "voice" ? "Type instead" : "Speak instead"}
          </button>
        </div>
      </div>

      <p className="mt-3 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 font-[family-name:var(--font-chalk)] text-[1.05rem] text-white/90 backdrop-blur-md">
        Recite: “{module.examConcept}”
      </p>

      {mode === "voice" ? (
        <div className="mt-4 flex items-center gap-4">
          <button
            onPointerDown={startTalking}
            onPointerUp={stopTalking}
            onPointerLeave={() => listening && stopTalking()}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all backdrop-blur-md border cursor-pointer ${
              listening
                ? "bg-white/40 border-white/70 text-white animate-pulse"
                : "bg-white/15 hover:bg-white/25 border-white/25 text-white"
            }`}
          >
            <MicIcon size={18} /> {listening ? "Listening… release to submit" : "Hold to recite"}
          </button>
          <Waveform active={listening} />
        </div>
      ) : (
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) evaluate(text);
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your recitation in your own words…"
            className="min-w-0 flex-1 rounded-xl border border-white/20 bg-black/50 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
          />
          <button className="rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-all backdrop-blur-md cursor-pointer">
            Check recall
          </button>
        </form>
      )}

      {listening && transcript && (
        <p className="mt-3 text-xs text-chalk/55">Heard: “{transcript}”</p>
      )}

      <AnimatePresence mode="wait">
        {verdict && (
          <motion.div
            key={`${attempts}-${verdict.passed}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`mt-4 rounded-2xl border px-4 py-3 ${
              verdict.passed
                ? "border-teal-soft/50 bg-teal/12"
                : "border-royal-soft/50 bg-royal/12"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className={verdict.passed ? "text-teal-soft" : "text-royal-soft"}>
                {verdict.passed ? <CheckSealIcon size={20} /> : <AlertIcon size={20} />}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${verdict.passed ? "text-teal-soft" : "text-royal-soft"}`}>
                  {verdict.passed
                    ? "Verified recall — 100% exam readiness unlocked!"
                    : `Almost there — ${verdict.readiness}% readiness. Recite once more.`}
                </p>
                <p className="mt-1 text-xs text-chalk/60">
                  {verdict.passed
                    ? `Keywords captured: ${verdict.matched.join(", ")}`
                    : `${module.hint} Missing: ${verdict.missing.join(", ")}`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  const bars = 22;
  return (
    <div className="flex h-10 flex-1 items-center gap-1">
      {Array.from({ length: bars }, (_, i) => (
        <motion.span
          key={i}
          className="w-full rounded-full bg-chalk/55"
          animate={
            active
              ? { height: [6, 10 + ((i * 13) % 26), 6] }
              : { height: 4 }
          }
          transition={
            active
              ? { duration: 0.6 + (i % 5) * 0.08, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

export default RecitationHUD;
