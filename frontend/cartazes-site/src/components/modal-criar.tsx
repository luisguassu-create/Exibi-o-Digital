"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Modal({ isOpen, onClose }: ModalProps) {
    const [salvando, setSalvando] = useState(false);
    const [renderizado, setRenderizado] = useState(isOpen);

    const overlayRef = useRef<HTMLDivElement>(null);
    const blurRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const fechandoRef = useRef(false);

    useLayoutEffect(() => {
        if (isOpen) {
            setRenderizado(true);
        }
    }, [isOpen]);

    useLayoutEffect(() => {
        const overlay = overlayRef.current;
        const blur = blurRef.current;
        const modal = modalRef.current;

        if (!overlay || !blur || !modal || !isOpen) return;

        const itens = Array.from(
            modal.querySelectorAll<HTMLElement>("[data-anim]")
        );

        gsap.set(blur, {
            autoAlpha: 0,
        });

        gsap.set(overlay, {
            autoAlpha: 0,
        });

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

        gsap.set(itens, {
            autoAlpha: 0,
            x: -60,
            y: 0,
            scale: 0.9,
        });
    }, [renderizado, isOpen]);

    useGSAP(
        () => {
            if (!renderizado || !isOpen) return;

            const overlay = overlayRef.current;
            const blur = blurRef.current;
            const modal = modalRef.current;

            if (!overlay || !blur || !modal) return;

            const itens = Array.from(
                modal.querySelectorAll<HTMLElement>("[data-anim]")
            );

            gsap.killTweensOf([blur, overlay, modal, ...itens]);

            const tl = gsap.timeline();

            tl.to(blur, {
                autoAlpha: 1,
                duration: 0.6,
                ease: "power2.out",
            })
                .to(
                    overlay,
                    {
                        autoAlpha: 1,
                        duration: 0.6,
                        ease: "power2.out",
                    },
                    "<"
                )
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
        },
        {
            scope: modalRef,
            dependencies: [isOpen, renderizado],
        }
    );

    const handleClose = () => {
        if (fechandoRef.current) return;

        const overlay = overlayRef.current;
        const blur = blurRef.current;
        const modal = modalRef.current;

        if (!overlay || !blur || !modal) {
            setRenderizado(false);
            onClose();
            return;
        }

        const itens = Array.from(
            modal.querySelectorAll<HTMLElement>("[data-anim]")
        );

        fechandoRef.current = true;

        gsap.killTweensOf([blur, overlay, modal, ...itens]);

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(blur, {
                    autoAlpha: 0,
                });

                gsap.set(overlay, {
                    autoAlpha: 0,
                });

                gsap.set(modal, {
                    autoAlpha: 0,
                });

                setRenderizado(false);
                fechandoRef.current = false;
                onClose();
            },
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
            )
            .to(
                blur,
                {
                    autoAlpha: 0,
                    duration: 0.35,
                    ease: "power2.inOut",
                },
                "-=0.35"
            );
    };

    function handleSalvar() {
        setSalvando(true);

        setTimeout(() => {
            setSalvando(false);
            handleClose();
        }, 900);
    }

    if (!renderizado && !isOpen) return null;

    return (
        <>
            <div
                ref={blurRef}
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 8,
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    isolation: "isolate",
                    opacity: 0,
                    visibility: "hidden",
                    pointerEvents: "auto",
                    willChange: "opacity",
                }}
            />

            <div
                ref={overlayRef}
                className="overlay"
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.55)",
                    zIndex: 9,
                    opacity: 0,
                    visibility: "hidden",
                    willChange: "opacity",
                }}
            />

            <div
                ref={modalRef}
                className="Edicao"
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "fixed",
                    top: "10vh",
                    right: "calc(50% - 430px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    background:
                        "linear-gradient(180deg, rgb(55, 56, 65) 0%, rgb(35, 36, 41) 100%)",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow:
                        "0 30px 60px -15px rgba(0, 0, 0, 0.45)",
                    zIndex: 10,
                    minWidth: "860px",
                    minHeight: "500px",
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased",
                    transformStyle: "preserve-3d",
                    opacity: 0,
                    visibility: "hidden",
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
                            Menu de Criação
                        </h1>

                        <button
                            onClick={handleClose}
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
                                }}
                            >
                                Editar Imagem
                            </label>

                            <input
                                id="imagem"
                                type="file"
                                style={{
                                    backgroundColor: "rgb(44, 44, 51)",
                                    color: "white",
                                    border: "none",
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
                                    Editar Nome
                                </label>

                                <input
                                    id="nome"
                                    type="text"
                                    style={{
                                        padding: "6px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
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
                                    Inicio
                                </label>

                                <input
                                    id="inicio"
                                    type="datetime-local"
                                    style={{
                                        color: "white",
                                        padding: "6px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
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
                                    style={{
                                        padding: "6px",
                                        color: "white",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
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
                                    style={{
                                        padding: "6px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
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
                                    Duracao (s)
                                </label>

                                <input
                                    id="duracao"
                                    type="number"
                                    style={{
                                        padding: "6px",
                                        borderRadius: "6px",
                                        border: "1px solid #cbd5e1",
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
                                    onClick={handleSalvar}
                                    disabled={salvando}
                                    style={{
                                        width: "110px",
                                        height: "36px",
                                        color: "white",
                                        fontWeight: 600,
                                        backgroundColor: salvando
                                            ? "rgb(151, 104, 104)"
                                            : "hsl(0, 50%, 36%)",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: salvando
                                            ? "default"
                                            : "pointer",
                                        transition:
                                            "background-color 0.3s ease, transform 0.15s ease",
                                        transform: salvando
                                            ? "scale(0.96)"
                                            : "scale(1)",
                                    }}
                                >
                                    {salvando ? "Salvando..." : "Salvar"}
                                </button>

                                <button
                                    onClick={handleClose}
                                    style={{
                                        width: "110px",
                                        height: "36px",
                                        color: "white",
                                        fontWeight: 600,
                                        backgroundColor: "rgb(86, 86, 86)",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        transition:
                                            "transform 0.15s ease",
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(0.96)";
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1)";
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