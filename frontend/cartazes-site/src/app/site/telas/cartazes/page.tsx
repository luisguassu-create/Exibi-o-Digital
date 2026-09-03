"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CardCartaz } from "@/app/Cartao/card-to-cartazes";
import { Bot } from "@/app/Botao/botao-criar";
import { Bote } from "@/app/Botao/botao-ee";
import { QuebraExpectativa } from "@/components/QuebraExpectativa";

export default function Cartzes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Seleciona todos os filhos diretos da tela e os elementos dentro do cabeçalho
      const elementos = [
        containerRef.current?.querySelector(".paralelo h1"),
        containerRef.current?.querySelector(".paralelo > * :not(h1)"), // seleciona o botão mantendo o layout intacto
        containerRef.current?.querySelector("hr"),
        ...Array.from(containerRef.current?.querySelectorAll(".windowc > :nth-child(n+3)") || [])
      ].filter(Boolean);

      // Animação apenas de opacidade e deslocamento vertical (sem alterar tamanhos/escalas)
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
  }, []);

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
      <div className="paralelo" style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
        <h1
          style={{
            color: " black",
            fontWeight: "bold",
            fontSize: "30px",
          }}
        >
          Cartazes
        </h1>
        <Bot texto={"Novo Cartaz"} corFundo={"#d10000"} />
      </div>
      <hr />

      <CardCartaz
        texto={"Prova amanha"}
        corFundo={""}
        textoBaixo={"Dia 10 ate o 25"} textoLado={"7:30 ate 11:30"}
      />
      <CardCartaz
        texto={"Evento Sexta"}
        corFundo={""}
        textoBaixo={"Dia 15 ate o 35"} textoLado={"13:00 ate 15:00"}
      />
     
    </div>
  );
}