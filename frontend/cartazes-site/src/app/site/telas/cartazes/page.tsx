"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { CardCartaz } from "@/app/Cartao/card-to-cartazes";
import { Bot } from "@/app/Botao/botao-criar";
import { QuebraExpectativa } from "@/components/QuebraExpectativa";

const API_URL = "http://localhost:3001";

type Cartaz = {
    id: number;
    titulo: string;
    imagem: string;
    horarioInicio: string;
    horarioFim: string;
    duracao: number;
    ordem: number;
};

export default function Cartzes() {
    const containerRef = useRef<HTMLDivElement>(null);

    const [cartazes, setCartazes] = useState<Cartaz[]>([]);
    const [carregando, setCarregando] = useState(true);

    const carregarCartazes = async () => {
        try {
            setCarregando(true);

            const resposta = await fetch(`${API_URL}/cartazes`);

            if (!resposta.ok) {
                throw new Error("Erro ao buscar os cartazes.");
            }

            const dados = await resposta.json();

            setCartazes(dados);
        } catch (erro) {
            console.error("Erro ao carregar cartazes:", erro);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarCartazes();
    }, []);

    const excluirCartaz = async (id: number) => {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este cartaz?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(`${API_URL}/cartazes/${id}`, {
                method: "DELETE",
            });

            if (!resposta.ok) {
                throw new Error("Erro ao excluir o cartaz.");
            }

            setCartazes((cartazesAtuais) =>
                cartazesAtuais.filter((cartaz) => cartaz.id !== id)
            );
        } catch (erro) {
            console.error("Erro ao excluir cartaz:", erro);
            alert("Não foi possível excluir o cartaz.");
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const elementos = [
                containerRef.current?.querySelector(".paralelo h1"),
                containerRef.current?.querySelector(
                    ".paralelo > *:not(h1)"
                ),
                containerRef.current?.querySelector("hr"),
                ...Array.from(
                    containerRef.current?.querySelectorAll(
                        ".windowc > :nth-child(n+3)"
                    ) || []
                ),
            ].filter(Boolean);

            gsap.fromTo(
                elementos,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: "power2.out",
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [cartazes]);

    return (
        <div
            ref={containerRef}
            className="windowc"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "50px",
            }}
        >
            <div
                className="paralelo"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center",
                }}
            >
                <h1
                    style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "30px",
                    }}
                >
                    Cartazes
                </h1>

                <Bot texto={"Novo Cartaz"} corFundo={"#d10000"} />
            </div>

            <hr />

            {carregando ? (
                <p>Carregando cartazes...</p>
            ) : cartazes.length === 0 ? (
                <p>Nenhum cartaz cadastrado.</p>
            ) : (
                cartazes.map((cartaz) => (
                    <CardCartaz
                        key={cartaz.id}
                        id={cartaz.id}
                        texto={cartaz.titulo}
                        imagem={cartaz.imagem}
                        corFundo={""}
                        textoBaixo={`${cartaz.horarioInicio} até ${cartaz.horarioFim}`}
                        textoLado={`${cartaz.duracao}s`}
                        onExcluir={excluirCartaz}
                    />
                ))
            )}
        </div>
    );
}