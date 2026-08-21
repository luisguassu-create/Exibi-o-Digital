"use client";
import { useState } from "react";

type Opcao = {
    label: string,
    onClick: () => void,
}

type Props = {
    corFundo: string,
    opcoes: Opcao[],
}

export function Botemais({ corFundo, opcoes }: Props) {
    const [aberto, setAberto] = useState(false);

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={() => setAberto(!aberto)}
                style={{
                    position: "absolute",
                    bottom: "-17px",
                    background: corFundo,
                    color: "black",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    minWidth: "32px",
                    flexShrink: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "4px 4px 12px 0px rgba(0,0,0,0.28)",
                }}
                className="boteemais"
            >
                {aberto ? "×" : "+"}
            </button>

            {aberto && (
                <div
                    style={{
                        position: "absolute",
                        top: "40px",
                        right: "0", // abre alinhado à direita, embaixo do botão
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
                    {opcoes.map((opcao, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                opcao.onClick();
                                setAberto(false);
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
                            {opcao.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}