"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ModalConfirmacao from "./modal-confirmacao";
import ModalConfirmacaoV from "./modal-confirmacaoVisual";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    opcao1: string;
    opcao2: string;
    onOpcao2Click?: () => void;
};

export default function Modal({ isOpen, onClose, opcao1, opcao2, onOpcao2Click }: ModalProps) {
    const [sairAberto, setSairAberto] = useState(false);
    const [visualAberto, setVisualAberto] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Garante que o Portal só renderize no lado do cliente (Next.js SSR safe)
    useEffect(() => {
        setMounted(true);
    }, []);

    function handleLogout() {
        router.push("/");
    }

    function Visualizar() {
        router.push('/site/telas/carrosel');
    }

    return (
        <>
            {/* 1. Menu Dropdown Principal - Só aparece se isOpen for true */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "40px",
                        right: "0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        background: "white",
                        borderRadius: "10px",
                        padding: "8px",
                        boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.28)",
                        zIndex: 10,
                        minWidth: "160px",
                    }}
                >
                    <button
                        onClick={() => {
                            setSairAberto(true);
                            onClose(); // Fecha o dropdown
                        }}
                        style={{
                            background: "#f0f0f0",
                            color: "black",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            textAlign: "left",
                        }}
                        className="opcao-botao"
                    >
                        {opcao1}
                    </button>

                    <button
                        onClick={() => {
                            setVisualAberto(true); // 1. Abre o modal de confirmação
                            onClose();             // 2. Fecha este dropdown
                        }}
                        style={{
                            background: "#f0f0f0",
                            color: "black",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            textAlign: "left",
                        }}
                        className="opcao-botao"
                    >
                        {opcao2}
                    </button>
                </div>
            )}

            {/* 2. Modais de Confirmação enviados para fora do Dropdown via Portal */}
            {mounted && createPortal(
                <>
                    <ModalConfirmacao
                        isOpen={sairAberto}
                        onClose={() => setSairAberto(false)}
                    />
                    <ModalConfirmacaoV
                        isOpen={visualAberto}
                        onClose={() => setVisualAberto(false)}
                    />
                </>,
                document.body
            )}
        </>
    );
}