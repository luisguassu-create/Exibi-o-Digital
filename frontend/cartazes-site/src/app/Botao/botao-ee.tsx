"use client";
import { useState } from "react";

type Props = {
    texto: string,
    corFundo: string,
}

export function Bote({ texto, corFundo }: Props) {
    const [aberto, setAberto] = useState(false);
    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={() => setAberto(!aberto)}
                style={{
                    background: corFundo,
                    color: "black",
                    border: "none",
                    borderRadius: "10px",
                    width: "80px",
                    padding: "10px",
                    boxShadow: " 8px 8px 28px 0px rgba(0,0,0,0.1)"
                }}
                className="botee"
            >
                {texto}
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
                                <h1>Menu de Edição</h1>
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
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                    <label htmlFor="">Editar Imagem</label>
                                    <input type="file" />
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "300px",
                                    gap: "7px"
                                }}>
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
                                            style={{
                                                width: "100px",
                                                height: "30px",
                                                color: "black",
                                                backgroundColor: "rgb(13, 188, 4)",
                                                border: "none",
                                                borderRadius: "10px"
                                            }}
                                        >
                                            Salvar
                                        </button>
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
                                    </div>
                                </div>
                            </section>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}