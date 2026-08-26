"use client";

import { useState } from "react";

type Props = {
    texto: string;
    corFundo: string;
};

export function Bot({ texto, corFundo }: Props) {
    const [aberto, setAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);

    function handleSalvar() {
        setSalvando(true);
        setTimeout(() => {
            setSalvando(false);
            setAberto(false);
        }, 900);
    }

    return (
        <>
            <button
                onClick={() => setAberto(!aberto)}
                style={{
                    background: "rgb(51, 52, 60)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    width: "130px",
                    padding: "10px"
                }}
                className="botc"
            >
                + {texto}
            </button>

            {aberto && (
                <>
                    <div className="overlay" onClick={() => setAberto(false)} />
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
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}>
                                <h1>Menu de Criação</h1>
                                <button onClick={() => setAberto(false)} style={{
                                    borderRadius: "10px",
                                    height: "30px",
                                    width: "30px"
                                }}>x</button>
                            </div>
                            <hr />
                            <section style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "30px"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label htmlFor="">Editar Imagem</label>
                                    <input type="file" />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        width: "300px",
                                        gap: "7px"
                                    }}
                                >
                                    <label htmlFor="">Editar Nome</label>
                                    <input type="text" />
                                    <label htmlFor="">Inicio</label>
                                    <input type="datetime-local" />
                                    <label htmlFor="">Fim</label>
                                    <input type="datetime-local" />
                                    <label htmlFor="">Ordem</label>
                                    <input type="number" />
                                    <label htmlFor="">Duracao (s)</label>
                                    <input type="number" />
                                    <div style={{
                                        display: "flex",
                                        gap: "20px",
                                        justifyContent: "end"
                                    }}>
                                        <button
                                            onClick={() => setAberto(false)}
                                            style={{
                                                width: "100px",
                                                height: "30px",
                                                color: "white",
                                                backgroundColor: "rgb(86, 86, 86)",
                                                border: "none",
                                                borderRadius: "10px"
                                            }}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={handleSalvar}
                                            disabled={salvando}
                                            style={{
                                                width: "100px",
                                                height: "30px",
                                                color: "white",
                                                backgroundColor: salvando ? "rgb(120, 170, 120)" : "rgb(46, 139, 87)",
                                                border: "none",
                                                borderRadius: "10px",
                                                cursor: salvando ? "default" : "pointer",
                                                transition: "background-color 0.3s ease, transform 0.15s ease",
                                                transform: salvando ? "scale(0.96)" : "scale(1)",
                                            }}
                                        >
                                            {salvando ? "Salvando..." : "Salvar"}
                                        </button>


                                        <div className="containerBotaoSalvar">
                                            <button id="button"></button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </div>
                </>
            )}
        </>
    );
}