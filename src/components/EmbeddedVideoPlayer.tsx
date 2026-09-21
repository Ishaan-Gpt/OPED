import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  url: string;
  loop?: boolean;
}

/** Clean, borderless, full-canvas video player that loops continuously while the teacher speaks. */
export default function EmbeddedVideoPlayer({ url, loop = true }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play().catch(() => {});
    }
  }, [url]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="relative w-full h-full min-h-[380px] sm:min-h-[460px] rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-2xl"
    >
      <video
        ref={videoRef}
        src={url}
        autoPlay
        playsInline
        muted
        loop={loop}
        className="w-full h-full object-cover sm:object-contain"
      />
    </motion.div>
  );
}
