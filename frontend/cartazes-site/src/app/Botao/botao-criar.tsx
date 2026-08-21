"use client";
import { useState } from "react";

type Props = {
    texto: string;
    corFundo: string;
};

export function Bot({ texto, corFundo }: Props) {
    const [aberto, setAberto] = useState(false);

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
                        <button onClick={() => setAberto(false)}>x</button>
                        <div> </div>
                        <h1>Menu de Criação</h1>
                        <hr />
                        <section style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label htmlFor="">Editar Imagem</label>
                                <input type="file" />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "300px",
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
                                <div style={{ display: "flex", gap: "20px" }}>
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
            )}
        </>
    );
}