"use client";

import { useState } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Modal({ isOpen, onClose }: ModalProps) {
    const [salvando, setSalvando] = useState(false);

    function handleSalvar() {
        setSalvando(true);
        setTimeout(() => {
            setSalvando(false);
            onClose();
        }, 900);
    }

    if (!isOpen) return null;

    return (
        <>
            <div
                className="overlay"
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 9,
                }}
            />
            <div
                style={{
                    position: "fixed",
                    top: "90px",
                    right: "230px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    background: "white",
                    borderRadius: "10px",
                    padding: "8px",
                    boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.28)",
                    zIndex: 10,
                    minWidth: "860px",
                    minHeight: "500px",
                }}
                className="Edicao"
            >
                <section>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <h1>Menu de Edição</h1>
                        <button
                            onClick={onClose}
                            style={{
                                borderRadius: "10px",
                                height: "30px",
                                width: "30px",
                            }}
                        >
                            x
                        </button>
                    </div>
                    <hr />
                    <section
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "30px",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="imagem">Editar Imagem</label>
                            <input id="imagem" type="file" />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                width: "300px",
                                gap: "7px",
                            }}
                        >
                            <label htmlFor="nome">Editar Nome</label>
                            <input id="nome" type="text" />
                            <label htmlFor="inicio">Inicio</label>
                            <input id="inicio" type="datetime-local" />
                            <label htmlFor="fim">Fim</label>
                            <input id="fim" type="datetime-local" />
                            <label htmlFor="ordem">Ordem</label>
                            <input id="ordem" type="number" />
                            <label htmlFor="duracao">Duracao (s)</label>
                            <input id="duracao" type="number" />
                            <div
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    justifyContent: "end",
                                }}
                            >
                                 <button
                                    onClick={handleSalvar}
                                    disabled={salvando}
                                    style={{
                                        width: "100px",
                                        height: "30px",
                                        color: "white",
                                        backgroundColor: salvando
                                            ? "rgb(120, 170, 120)"
                                            : "rgb(46, 139, 87)",
                                        border: "none",
                                        borderRadius: "10px",
                                        cursor: salvando ? "default" : "pointer",
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
                                        width: "100px",
                                        height: "30px",
                                        color: "white",
                                        backgroundColor: "rgb(86, 86, 86)",
                                        border: "none",
                                        borderRadius: "10px",
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