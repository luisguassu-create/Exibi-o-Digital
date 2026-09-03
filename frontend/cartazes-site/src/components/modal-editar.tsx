"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // Opcional: passe os dados iniciais do item sendo editado
  initialData?: FormData;
};

interface FormData {
  imagem: File | null;
  nome: string;
  inicio: string;
  fim: string;
  ordem: string;
  duracao: string;
}

const defaultData: FormData = {
  imagem: null,
  nome: "",
  inicio: "",
  fim: "",
  ordem: "",
  duracao: "",
};

export default function ModalEdicao({ isOpen, onClose, initialData }: ModalProps) {
  const [salvando, setSalvando] = useState(false);
  const [renderizado, setRenderizado] = useState(false);

  // Dados atuais do formulário e cópia dos dados originais para comparação
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [originalData, setOriginalData] = useState<FormData>(defaultData);
  
  // Botão inicia DESATIVADO (false) até que algo seja mudado
  const [isDirty, setIsDirty] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const btnSalvarRef = useRef<HTMLButtonElement>(null);

  // Reseta os dados e o estado ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const base = initialData || defaultData;
      setFormData(base);
      setOriginalData(base);
      setIsDirty(false); // <--- Inicia desativado por padrão
      setRenderizado(true);
    }
  }, [isOpen, initialData]);

  // Manipulador de mudança nos inputs + Verificação de alteração real
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    const newValue = files ? files[0] || null : value;

    const updatedForm = {
      ...formData,
      [id]: newValue,
    };

    setFormData(updatedForm);

    // Compara se o estado atual é diferente do original
    const mudou = JSON.stringify(updatedForm) !== JSON.stringify(originalData);
    setIsDirty(mudou);
  };

  // Animação do botão ativando quando 'isDirty' vira true
  useGSAP(() => {
    if (isDirty && btnSalvarRef.current) {
      gsap.fromTo(
        btnSalvarRef.current,
        { scale: 0.8, rotation: -5 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1.2, 0.4)",
        }
      );
    }
  }, { dependencies: [isDirty] });

  useGSAP(
    () => {
      if (!renderizado) return;

      const overlay = overlayRef.current;
      const modal = modalRef.current;
      if (!overlay || !modal) return;

      const itens = Array.from(modal.querySelectorAll("[data-anim]"));

      if (isOpen) {
        gsap.set(overlay, { autoAlpha: 0 });

        gsap.set(modal, {
          autoAlpha: 0,
          transformPerspective: 2000,
          transformOrigin: "center center",
          scale: 0.3,
          z: -1000,
          x: 250,
          y: 150,
          rotationX: 45,
          rotationY: 35,
          rotationZ: -10,
        });

        gsap.set(itens, { autoAlpha: 0, x: -60, y: 0, scale: 0.9 });

        const tl = gsap.timeline();

        tl.to(overlay, {
          autoAlpha: 1,
          duration: 0.6,
          ease: "power2.out",
        })
          .to(
            modal,
            {
              scale: 1,
              z: 0,
              x: 0,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              duration: 1.4,
              ease: "elastic.out(1, 0.65)",
            },
            "-=0.4"
          )
          .to(
            modal,
            {
              autoAlpha: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            "<"
          )
          .to(
            itens,
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.06,
              ease: "back.out(1.5)",
            },
            "-=1.1"
          );
      } else {
        const tl = gsap.timeline({
          onComplete: () => setRenderizado(false),
        });

        tl.to(itens, {
          autoAlpha: 0,
          scale: 0.8,
          x: 30,
          duration: 0.25,
          stagger: 0.02,
          ease: "power2.in",
        })
          .to(
            modal,
            {
              autoAlpha: 0,
              scale: 0.5,
              z: -600,
              y: 100,
              rotationX: -30,
              rotationY: -15,
              duration: 0.6,
              ease: "power3.inOut",
            },
            "-=0.15"
          )
          .to(
            overlay,
            {
              autoAlpha: 0,
              duration: 0.4,
              ease: "power2.inOut",
            },
            "-=0.4"
          );
      }
    },
    { scope: modalRef, dependencies: [isOpen, renderizado] }
  );

  function handleSalvar() {
    if (!isDirty) return;

    setSalvando(true);

    setTimeout(() => {
      setSalvando(false);
      onClose();
    }, 900);
  }

  if (!renderizado) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          isolation: "isolate",
          zIndex: 9,
          opacity: 0,
          visibility: "hidden",
          willChange: "opacity",
        }}
      />

      <div
        ref={modalRef}
        className="Edicao"
        style={{
          position: "fixed",
          top: "10vh",
          right: "calc(50% - 430px)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          background:
            "linear-gradient(180deg, rgb(51, 52, 60) 0%, rgb(38, 39, 45) 100%)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.35)",
          zIndex: 10,
          minWidth: "860px",
          minHeight: "500px",
          opacity: 0,
          visibility: "hidden",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          transformStyle: "preserve-3d",
          fontFamily: "inherit", // Garante a mesma tipografia do projeto
        }}
      >
        <section>
          <div
            data-anim
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
              className="textocomborda"
            >
              Editar Item
            </h1>

            <button
              onClick={onClose}
              style={{
                borderRadius: "8px",
                height: "32px",
                width: "32px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </div>

          <hr
            data-anim
            style={{
              borderTop: "1px solid #f1f5f9",
              margin: "16px 0",
            }}
          />

          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 10px",
            }}
          >
            <div
              data-anim
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label
                htmlFor="imagem"
                style={{
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "white",
                  fontSize: "1rem",
                }}
              >
                Imagem
              </label>

              <input
                id="imagem"
                type="file"
                onChange={handleChange}
                style={{
                  backgroundColor: "rgb(44, 44, 51)",
                  color: "white",
                  border: "none",
                  fontFamily: "inherit",
                }}
                className="hoverChoose"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "300px",
                gap: "10px",
              }}
            >
              <div
                data-anim
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <label
                  htmlFor="nome"
                  style={{
                    fontSize: "0.9rem",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  Nome
                </label>

                <input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  style={{
                    padding: "6px",
                    color: "white",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                data-anim
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <label
                  htmlFor="inicio"
                  style={{
                    fontSize: "0.9rem",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  Início
                </label>

                <input
                  id="inicio"
                  type="datetime-local"
                  value={formData.inicio}
                  onChange={handleChange}
                  style={{
                    color: "white",
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                data-anim
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <label
                  htmlFor="fim"
                  style={{
                    fontSize: "0.9rem",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  Fim
                </label>

                <input
                  id="fim"
                  type="datetime-local"
                  value={formData.fim}
                  onChange={handleChange}
                  style={{
                    padding: "6px",
                    color: "white",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                data-anim
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <label
                  htmlFor="ordem"
                  style={{
                    fontSize: "0.9rem",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  Ordem
                </label>

                <input
                  id="ordem"
                  type="number"
                  value={formData.ordem}
                  onChange={handleChange}
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    color: "white",
                    border: "1px solid #cbd5e1",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                data-anim
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <label
                  htmlFor="duracao"
                  style={{
                    fontSize: "0.9rem",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  Duração (s)
                </label>

                <input
                  id="duracao"
                  type="number"
                  value={formData.duracao}
                  onChange={handleChange}
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    color: "white",
                    border: "1px solid #cbd5e1",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                data-anim
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "end",
                  marginTop: "16px",
                }}
              >
                <button
                  ref={btnSalvarRef}
                  onClick={handleSalvar}
                  disabled={salvando || !isDirty}
                  style={{
                    width: "110px",
                    height: "36px",
                    color: "white",
                    fontWeight: 600,
                    fontFamily: "inherit",
                    backgroundColor: salvando
                      ? "rgb(151, 104, 104)"
                      : isDirty
                      ? "hsl(0, 70%, 45%)" // Vermelho ativo só quando houver mudança
                      : "rgb(100, 100, 100)", // Cinza padrão desativado
                    border: "none",
                    borderRadius: "8px",
                    cursor: salvando || !isDirty ? "not-allowed" : "pointer",
                    transition:
                      "background-color 0.3s ease, transform 0.15s ease",
                    transform: salvando ? "scale(0.96)" : "scale(1)",
                  }}
                >
                  {salvando ? "Salvando..." : "Salvar"}
                </button>

                <button
                  onClick={onClose}
                  style={{
                    width: "110px",
                    height: "36px",
                    color: "white",
                    fontWeight: 600,
                    fontFamily: "inherit",
                    backgroundColor: "rgb(86, 86, 86)",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.96)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </>
  );
}