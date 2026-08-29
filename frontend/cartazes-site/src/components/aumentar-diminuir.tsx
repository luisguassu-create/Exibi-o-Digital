"use client";

import React, { useEffect, useRef } from "react";
import styles from "./aumentar-diminuir.module.css";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface ScaleProps {
  targetRef: React.RefObject<HTMLElement | null>;
  onResize?: (width: number, height: number, x: number, y: number) => void;
}

export default function Scale({ targetRef, onResize }: ScaleProps) {
  const handleTL = useRef<HTMLDivElement>(null);
  const handleTR = useRef<HTMLDivElement>(null);
  const handleBL = useRef<HTMLDivElement>(null);
  const handleBR = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const setupDrag = (handle: HTMLDivElement | null, corner: Corner) => {
      if (!handle) return;

      const onMouseDown = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const rect = target.getBoundingClientRect();
        const startWidth = rect.width;
        const startHeight = rect.height;

        const parentRect = target.parentElement?.getBoundingClientRect();
        const startLeft = rect.left - (parentRect?.left || 0);
        const startTop = rect.top - (parentRect?.top || 0);

        const onMouseMove = (moveEvent: MouseEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;

          let newWidth = startWidth;
          let newHeight = startHeight;
          let newLeft = startLeft;
          let newTop = startTop;

          if (corner.includes("right")) {
            newWidth = Math.max(50, startWidth + deltaX);
          }
          if (corner.includes("left")) {
            newWidth = Math.max(50, startWidth - deltaX);
            newLeft = startLeft + (startWidth - newWidth);
          }
          if (corner.includes("bottom")) {
            newHeight = Math.max(50, startHeight + deltaY);
          }
          if (corner.includes("top")) {
            newHeight = Math.max(50, startHeight - deltaY);
            newTop = startTop + (startHeight - newHeight);
          }

          target.style.width = `${newWidth}px`;
          target.style.height = `${newHeight}px`;
          
          if (corner.includes("left")) target.style.left = `${newLeft}px`;
          if (corner.includes("top")) target.style.top = `${newTop}px`;

          if (onResize) {
            onResize(newWidth, newHeight, newLeft, newTop);
          }
        };

        const onMouseUp = () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      };

      handle.addEventListener("mousedown", onMouseDown);
      return () => handle.removeEventListener("mousedown", onMouseDown);
    };

    const cleanups = [
      setupDrag(handleTL.current, "top-left"),
      setupDrag(handleTR.current, "top-right"),
      setupDrag(handleBL.current, "bottom-left"),
      setupDrag(handleBR.current, "bottom-right"),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
    };
  }, [targetRef, onResize]);

  // Se o alvo não estiver montado no DOM, evita renderizar o overlay quebrado
  if (!targetRef.current) return null;

  return (
    <div className={styles.selectionOverlay}>
      <div ref={handleTL} className={`${styles.handle} ${styles.tl}`} />
      <div ref={handleTR} className={`${styles.handle} ${styles.tr}`} />
      <div ref={handleBL} className={`${styles.handle} ${styles.bl}`} />
      <div ref={handleBR} className={`${styles.handle} ${styles.br}`} />
    </div>
  );
}