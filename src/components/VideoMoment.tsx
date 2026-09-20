import { motion } from "framer-motion";
import { CloseIcon } from "@/components/icons";

interface Props {
  title: string;
  /** null while the clip is still rendering */
  url: string | null;
  onClose: () => void;
}

/** Full-screen adaptive explainer clip, generated on the fly by the AI teacher. */
export function VideoMoment({ title, url, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 grid place-items-center bg-[#101a17]"
    >
      {url ? (
        <video
          key={url}
          src={url}
          autoPlay
          controls
          onEnded={onClose}
          className="max-h-[85vh] w-full max-w-[1100px] rounded-2xl shadow-2xl"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-chalk/70">
          <span className="size-8 animate-spin rounded-full border-2 border-chalk/25 border-t-teal-soft" />
          <p className="text-sm">Generating a quick explainer clip…</p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div className="pointer-events-auto rounded-2xl bg-black/35 px-4 py-2.5 backdrop-blur">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-chalk/45">Adaptive Video</p>
          <p className="font-[family-name:var(--font-display)] text-lg text-chalk">{title}</p>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto grid size-11 place-items-center rounded-full bg-chalk text-[#101a17] transition-transform hover:scale-105 active:scale-95"
          aria-label="Close video"
        >
          <CloseIcon size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export default VideoMoment;
