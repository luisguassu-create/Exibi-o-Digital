"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CardCartaz } from "@/app/Cartao/card-to-cartazes";
import { Bot } from "@/app/Botao/botao-criar";
import { Bote } from "@/app/Botao/botao-ee";
import { CardProg } from "@/app/Cartao/card-to-prog";

export default function Cartzes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Captura o título, a linha e os elementos de card na ordem exata de exibição
      const elementos = [
        containerRef.current?.querySelector(".paralelo h1"),
        containerRef.current?.querySelector("hr"),
        ...Array.from(containerRef.current?.querySelectorAll(".windowc > :nth-child(n+3)") || [])
      ].filter(Boolean);

      // Aplica animação apenas em opacidade e posição vertical (preserva tamanhos e dimensões)
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
      <div className="paralelo">
        <h1
          style={{
            color: " black",
            fontWeight: "bold",
            fontSize: "30px",
          }}
        >
          Programação
        </h1>
      </div>
      <hr />

      <CardProg
        texto={"Prova amanha"}
        corFundo={""}
        papel={"visible"}
        textoBaixo={""}
        horaInicio={"8:00"}
        horaFim={"9:30"}
        sala={"Sala 102"}
        docente={"Alexandre e Bruno"}
        atividade={"Prova"}
      />
      <CardProg
        texto={"Evento"}
        corFundo={""}
        calendario={"visible"}
        textoBaixo={""}
        horaInicio={"14:00"}
        horaFim={"15:00"}
        sala={"Refeitorio"}
        docente={"Sandro"}
        atividade={"Envento"}
      />
    </div>
  );
}