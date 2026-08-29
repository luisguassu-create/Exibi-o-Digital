"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Avatar from "@mui/material/Avatar";

gsap.registerPlugin(useGSAP);

type ModalConfirmacaoProps = {
  isOpen?: boolean;
  onClose: () => void;
  onSave?: (novoNome: string, novoAvatar: string | null) => void; // Envia nome e imagem
};

export default function Modal({ isOpen, onClose, onSave }: ModalConfirmacaoProps) {
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // Estado da imagem selecionada

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const [renderModal, setRenderModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRenderModal(true);
    }
  }, [isOpen]);

  // Função para capturar a imagem escolhida
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl); // Atualiza a prévia no Modal
    }
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
              duration: 1.1,
              ease: "elastic.out(1.1, 0.4)",
            },
            "-=0.2"
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

  function handleSalvar() {
    setSalvando(true);

    setTimeout(() => {
      setSalvando(false);
      if (onSave) {
        onSave(nome, avatarUrl); // Passa nome e/ou avatar salvo
      }
      handleCloseWithAnimation();
    }, 900);
  }

  if (!renderModal) return null;

  return (
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
        zIndex: 50,
        perspective: "1000px",
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
          zIndex: 51,
          minWidth: "10px",
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
            width: "250px",
            height: "100%",
          }}
        >
          <div
            ref={contentRef}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              width: "100%",
            }}
          >
            {/* Input aciona handleImageChange no onChange */}
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <label
              htmlFor="upload"
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>Mude seu Avatar</span>
              <Avatar
                src={avatarUrl || undefined} // Mostra a imagem selecionada no modal
                sx={{
                  width: 64,
                  height: 64,
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#484848",
                  textDecoration: "underline",
                }}
              >
                Selecionar nova imagem
              </span>
            </label>

            <label htmlFor="nome" style={{ fontSize: "20px" }}>
              Mude seu Nome
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                width: "80%",
                boxSizing: "border-box",
                textAlign: "center",
                fontSize: "20px",
              }}
            />
          </div>

          <div
            ref={buttonsRef}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: salvando ? "41%" : "31%",
              marginTop: "8px",
            }}
          >
            <button
              onClick={handleSalvar}
              disabled={salvando}
              style={{
                padding: "8px 24px",
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
                backgroundColor: salvando
                  ? "rgb(151, 104, 104)"
                  : "hsl(0, 50%, 36%)",
                border: "none",
                borderRadius: "8px",
                cursor: salvando ? "default" : "pointer",
                transition:
                  "background-color 0.3s ease, transform 0.15s ease",
                transform: salvando ? "scale(0.96)" : "scale(1)",
              }}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}