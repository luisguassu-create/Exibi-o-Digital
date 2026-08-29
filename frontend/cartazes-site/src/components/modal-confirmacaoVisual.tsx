"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./modalConfirma.css";

gsap.registerPlugin(useGSAP);

type ModalConfirmacaoProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalConfirmacaoV({
  isOpen,
  onClose,
}: ModalConfirmacaoProps) {
  const router = useRouter();

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const [renderModal, setRenderModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRenderModal(true);
    }
  }, [isOpen]);

  function Visualizar() {
    handleCloseWithAnimation();
    setTimeout(() => {
      router.push("/site/telas/carroselVisual");
    }, 1);
  }

  const { contextSafe } = useGSAP(
    () => {
      if (!renderModal) return;

      const modal = modalRef.current;
      const overlay = overlayRef.current;
      const content = contentRef.current;
      const buttons = buttonsRef.current;

      if (!modal || !overlay || !content || !buttons) return;

      gsap.killTweensOf([modal, overlay, content, buttons]);

      if (isOpen) {
        gsap.set(overlay, { autoAlpha: 0 });

        gsap.set(modal, {
          autoAlpha: 0,
          y: 120,
          scale: 0.6,
          rotationX: -25,
          transformPerspective: 1000,
          transformOrigin: "50% 100%",
        });

        gsap.set([content, buttons], {
          autoAlpha: 0,
          y: 10,
        });

        const tl = gsap.timeline();

        tl.to(overlay, {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.out",
        })
          .to(
            modal,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 1.2,
              ease: "elastic.out(1.2, 0.4)",
            },
            "-=0.3"
          )
          .to(
            [content, buttons],
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.7"
          );
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            setRenderModal(false);
            onClose();
          },
        });

        tl.to(modal, {
          autoAlpha: 0,
          y: 40,
          scale: 0.8,
          duration: 0.3,
          ease: "power3.in",
        }).to(
          overlay,
          {
            autoAlpha: 0,
            duration: 0.25,
            ease: "power2.in",
          },
          "-=0.2"
        );
      }
    },
    {
      scope: modalRef,
      dependencies: [isOpen, renderModal],
    }
  );

  const handleCloseWithAnimation = contextSafe(() => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;

    if (!modal || !overlay) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setRenderModal(false);
        onClose();
      },
    });

    tl.to(modal, {
      autoAlpha: 0,
      y: 40,
      scale: 0.8,
      duration: 0.3,
      ease: "power3.in",
    }).to(
      overlay,
      {
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      "-=0.2"
    );
  });

  if (!renderModal || !mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleCloseWithAnimation}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        perspective: "1000px",
        isolation: "isolate",
      }}
      className="overlay"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          background: "white",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.35)",
          zIndex: 100000,
          minWidth: "320px",
          minHeight: "150px",
          backfaceVisibility: "hidden",
          willChange: "transform, opacity",
          transformStyle: "preserve-3d",
        }}
        className="Edicao"
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            height: "100%",
          }}
        >
          <h2
            ref={contentRef}
            style={{
              fontSize: "18px",
              textAlign: "center",
              margin: 0,
              color: "#1a1a1a",
            }}
          >
            Você deseja ir para visualização?
          </h2>

          <div
            ref={buttonsRef}
            style={{
              display: "flex",
              gap: "12px",
            }}
            className="doisbutt"
          >
            <button className="aa" onClick={Visualizar}>
              Sim
            </button>

            <button className="ab" onClick={handleCloseWithAnimation}>
              Não
            </button>
          </div>
        </section>
      </div>
    </div>,
    document.body
  );
}