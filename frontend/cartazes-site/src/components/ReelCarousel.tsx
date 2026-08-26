// src/components/ReelCarousel.tsx
"use client";

import { useState, useEffect, useRef, startTransition, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Reel = {
  image: { src: string; alt: string };
  date: string;
  title: string;
  description: string;
};

const defaultReels: Reel[] = [
  {
    image: { src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg", alt: "Gradiente 1" },
    date: "2024-01-15",
    title: "Mountain Adventure",
    description: "Explorando picos e vales durante o inverno.",
  },
  {
    image: { src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg", alt: "Gradiente 2" },
    date: "2024-01-20",
    title: "Ocean Serenity",
    description: "Momentos de paz onde o oceano encontra o horizonte.",
  },
  {
    image: { src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg", alt: "Gradiente 3" },
    date: "2024-01-25",
    title: "Forest Journey",
    description: "Caminhando por trilhas antigas cheias de mistério.",
  },
];

export default function ReelCarousel({
  reels = defaultReels,
  autoPlaySpeed = 4000,
  pauseOnHover = true,
}: {
  reels?: Reel[];
  autoPlaySpeed?: number;
  pauseOnHover?: boolean;
}) {
  const [currentReel, setCurrentReel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<number | null>(null);

  const nextReel = () =>
    startTransition(() => {
      setCurrentReel((prev) => (prev + 1) % reels.length);
      setProgress(0);
    });

  const prevReel = () =>
    startTransition(() => {
      setCurrentReel((prev) => (prev - 1 + reels.length) % reels.length);
      setProgress(0);
    });

  useEffect(() => {
    if (isPaused) return;
    progressRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextReel();
          return 0;
        }
        return prev + 100 / (autoPlaySpeed / 16);
      });
    }, 16);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPaused, currentReel, autoPlaySpeed]);

  const reel = reels[currentReel];
  if (!reel) return null;

  // ---- estilos inline (sem Tailwind) ----
  const styles: Record<string, CSSProperties> = {
    container: {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      borderRadius: 12,
    },
    imageWrapper: {
      position: "absolute",
      inset: 0,
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    overlay: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
    },
    progressRow: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      display: "flex",
      gap: 4,
      zIndex: 20,
    },
    progressTrack: {
      flex: 1,
      height: 4,
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 999,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#fff",
    },
    content: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: 24,
      zIndex: 10,
      color: "#fff",
    },
    date: {
      fontSize: 12,
      opacity: 0.8,
      margin: "0 0 4px 0",
    },
    title: {
      fontSize: 24,
      fontWeight: 600,
      margin: "0 0 4px 0",
    },
    description: {
      fontSize: 14,
      opacity: 0.9,
      margin: 0,
    },
    arrowBase: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 20,
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "rgba(0,0,0,0.35)",
      border: "none",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
    },
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentReel}
          style={styles.imageWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src={reel.image.src} alt={reel.image.alt} style={styles.image} />
          <div style={styles.overlay} />
        </motion.div>
      </AnimatePresence>

      <div style={styles.progressRow}>
        {reels.map((_, i) => (
          <div key={i} style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: i === currentReel ? `${progress}%` : i < currentReel ? "100%" : "0%",
                transition: i === currentReel ? "none" : "width 0.3s ease",
              }}
            />
          </div>
        ))}
      </div>

      <div style={styles.content}>
        {/* <p style={styles.date}>{new Date(reel.date).toLocaleDateString("pt-BR")}</p>
        <h2 style={styles.title}>{reel.title}</h2>
        <p style={styles.description}>{reel.description}</p> */}
      </div>

      <button onClick={prevReel} style={{ ...styles.arrowBase, left: 16 }}>
        ‹
      </button>
      <button onClick={nextReel} style={{ ...styles.arrowBase, right: 16 }}>
        ›
      </button>
    </div>
  );
}