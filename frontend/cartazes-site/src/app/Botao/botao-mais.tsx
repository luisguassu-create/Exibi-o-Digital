"use client";
import { useRouter } from "next/navigation";
import router from "next/router";
import { useState } from "react";

type Opcao = {
    label: string,
    onClick: () => void,
}

type Props = {
    corFundo: string,
    opcao1: string,
    opcao2: string,
}



export function Botemais({ corFundo, opcao1, opcao2 }: Props) {
    const [aberto, setAberto] = useState(false);
    const [sairAberto, setSairAberto] = useState(false);
    const router = useRouter()

    function handleLogout() {
  router.push("/");
}

    return (
        
        <div style={{ position: "relative" }}>
            <button
                onClick={() => setAberto(!aberto)}
                style={{
                    position: "absolute",
                    bottom: "-17px",
                    background: "rgb(158, 12, 5)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    width: "45px",
                    height: "30px",
                    minWidth: "32px",
                    flexShrink: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "4px 4px 12px 0px rgba(0,0,0,0.28)",
                }}
                className="boteemais"
            >
                {aberto ? "×" : "▼"}
            </button>

            {aberto && (
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
                    {/* Botão opcao1 -> "Sair", abre o painel SairAberto */}
                    <button
                        onClick={() => {
                            setSairAberto(true);
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
                        {opcao1}
                    </button>

                    {/* Botão opcao2 */}
                    <button
                        onClick={() => {
                            console.log("clicou em", opcao2);
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
                        {opcao2}
                    </button>

                 
                </div>
            )}

            {sairAberto && (
                <>
                    <div className="overlay" onClick={() => setSairAberto(false)} />
                    <div
                        style={{
                            position: "fixed",
                            top: "275px",
                            right: "450px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            background: "white",
                            borderRadius: "10px",
                            padding: "8px",
                            boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.28)",
                            zIndex: 20,
                            minWidth: "300px",
                            minHeight: "150px",
                        }}
                        className="Edicao"
                    >
                        <section style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                        }}>
                            <h1>Você realmente deseja sair</h1>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                }}
                                
                                className="doisbutt">
                               <button className="aa" onClick={() => handleLogout()}>Sim</button>
                                <button className="ab" onClick={() => {
                            
                                setSairAberto(false);
                            }}>Não</button>
                            </div>
                        </section>

                    </div>
                </>
            )}
        </div>
    );
}