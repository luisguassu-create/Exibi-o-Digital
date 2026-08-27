"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type ModalConfirmacaoProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function ModalConfirmacao({ isOpen, onClose }: ModalConfirmacaoProps) {
    const router = useRouter();
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    function handleLogout() {
        router.push("/");
    }

    useGSAP(() => {
        if (isOpen && modalRef.current && overlayRef.current) {
            // Animação de entrada do overlay
            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );

            // Animação 3D Flip de entrada no Modal
            gsap.fromTo(
                modalRef.current,
                {
                    opacity: 0,
                    rotationX: -80,
                    scale: 0.7,
                    transformPerspective: 1000,
                    transformOrigin: "top center",
                },
                {
                    opacity: 1,
                    rotationX: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.5)",
                }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 50,
                perspective: "1000px", // Habilita profundidade 3D
            }}
            className="overlay"
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro do modal
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    background: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.25)",
                    zIndex: 51,
                    minWidth: "320px",
                    minHeight: "150px",
                    backfaceVisibility: "hidden", // Deixa a rotação 3D limpa
                }}
                className="Edicao"
            >
                <section
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "18px",
                        height: "100%",
                    }}
                >
                    <h2 style={{ fontSize: "18px", textAlign: "center", margin: 0, color: "#1a1a1a" }}>
                        Você realmente deseja sair?
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                        }}
                        className="doisbutt"
                    >
                        <button className="aa" onClick={handleLogout}>
                            Sim
                        </button>
                        <button className="ab" onClick={onClose}>
                            Não
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}