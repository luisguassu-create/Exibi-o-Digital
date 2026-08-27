"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalConfirmacao from "./modal-confirmacao";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    opcao1: string;
    opcao2: string;
    onOpcao2Click?: () => void;
};

export default function Modal({ isOpen, onClose, opcao1, opcao2, onOpcao2Click }: ModalProps) {
    const [sairAberto, setSairAberto] = useState(false);
    const router = useRouter();

    function handleLogout() {
        router.push("/");
    }

    if (!isOpen) return null;

    return (
        <>
            {/* Menu Dropdown Principal */}
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
                        console.log("clicou em", opcao2);
                        if (onOpcao2Click) onOpcao2Click();
                        onClose();
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

           
                <>
                   
                        <ModalConfirmacao
                            isOpen={sairAberto}
                            onClose={() => setSairAberto(false)}
                        />
               
                </>
           
        </>
    );
}