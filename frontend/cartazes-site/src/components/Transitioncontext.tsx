"use client";

import { createContext, useContext, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import SenaiLogo from "../../public/assets/images/SENAI-SP.jpg";

type TransitionContextType = {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  navigateWithTransition: (path: string) => void;
  revealHeaderAndSidebar: () => void;
  revealPlainPage: () => void;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

const COR_TRANSICAO = "#dc251c";

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Entrar com o overlay tampando da base até cobrir a tela cheia (y: 0%)
  const navigateWithTransition = useCallback(
    (path: string) => {
      const overlay = overlayRef.current;
      const logo = logoRef.current;

      if (!overlay) {
        router.push(path);
        return;
      }

      gsap.killTweensOf([overlay, logo]);

      // Prepara o overlay na parte inferior (fora da tela)
      gsap.set(overlay, {
        display: "flex",
        yPercent: 100,
        y: 0,
      });

      gsap.set(logo, {
        opacity: 0,
        scale: 0.85,
      });

      const tl = gsap.timeline({
        onComplete: () => router.push(path),
      });

      // Anima de baixo (100%) para cobrir a tela INTEIRA (0%)
      tl.to(overlay, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.inOut",
      }).to(
        logo,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.4"
      );
    },
    [router]
  );

  // Revela a nova tela subindo o overlay que já está cobrindo a tela inteira para -100%
  const revealHeaderAndSidebar = useCallback(() => {
    const overlay = overlayRef.current;

    const tl = gsap.timeline();

    if (overlay) {
      // Garante que se o overlay estiver ativo, ele comece cobrindo tudo (0%) e suba (-100%)
      gsap.set(overlay, { display: "flex", yPercent: 0 });

      tl.to(overlay, {
        yPercent: -100,
        duration: 0.85,
        ease: "power3.inOut",
      }).set(overlay, {
        display: "none",
        yPercent: 100,
      });
    }

    // --- ANIMAÇÃO DA SIDEBAR ULTRA SUAVE ---
    gsap.set(".side-bar, .side-bar-btn", { willChange: "transform, opacity" });

    tl.fromTo(
      ".cabeçalho, header",
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(
      ".side-bar",
      { x: -60, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "expo.out" 
      },
      "-=0.4"
    )
    .fromTo(
      ".side-bar-btn",
      { x: -35, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.04, 
        ease: "power4.out", 
        onComplete: () => {
          gsap.set(".side-bar, .side-bar-btn", { clearProps: "willChange" });
        }
      },
      "-=0.6" 
    );
  }, []);

  const revealPlainPage = useCallback(() => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    gsap.killTweensOf(overlay);

    // Garante visibilidade e inicia tampando a tela
    gsap.set(overlay, { display: "flex", yPercent: 0 });

    gsap.timeline()
      .to(overlay, {
        yPercent: -100,
        duration: 0.85,
        ease: "power3.inOut",
      })
      .set(overlay, {
        display: "none",
        yPercent: 100,
      });
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        overlayRef,
        navigateWithTransition,
        revealHeaderAndSidebar,
        revealPlainPage,
      }}
    >
      {children}

      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0, // Garante top:0, left:0, right:0, bottom:0
          width: "100vw",
          height: "100vh",
          backgroundColor: COR_TRANSICAO,
          zIndex: 99999, // Aumentado para garantir que fique por cima de tudo
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <div
          ref={logoRef}
          style={{
            position: "relative",
            width: "240px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={SenaiLogo}
            alt="SENAI Logo"
            priority
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error(
      "useTransition precisa ser usado dentro de <TransitionProvider>"
    );
  }
  return ctx;
}