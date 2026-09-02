"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SpotlightCard from "@/components/SpotlightCard";
import { Bot } from "../../../Botao/botao-criar";
import { Cards } from "../../../Cartao/Card";
import Scale from "@/components/aumentar-diminuir";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Animação de Entrada ao montar o componente
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Título principal e linha divisória
      tl.fromTo(
        ".anim-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      // 2. Animação Stagger nos SpotlightCards (fade + slide up + leve zoom)
      .fromTo(
        ".custom-spotlight-card",
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 },
        "-=0.3"
      )
      // // 3. Botão "Novo Cartaz" surgindo com um leve pop
      // .fromTo(
      //   ".anim-button",
      //   { opacity: 0, scale: 0.8, y: 20 },
      //   { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
      //   "-=0.2"
      // )
      // 4. Segundo Título (Próximos Avisos)
      .fromTo(
        ".titulo",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4 },
        "-=0.2"
      )
      // 5. Itens da lista surgindo sequencialmente
      .fromTo(
        ".ListaAnimation li",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      )
      .fromTo(
        ".ListaAnimation hr",
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.4, transformOrigin: "left center" },
        "<"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Função para acionar a Animação de Saída
  const handleExit = (onComplete?: () => void) => {
    if (isExiting) return;
    setIsExiting(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.in" },
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // Animação inversa rápida para sair da tela
      tl.to(".ListaAnimation li, .ListaAnimation hr", {
        opacity: 0,
        x: 20,
        duration: 0.2,
        stagger: 0.05,
      })
      .to(".titulo", { opacity: 0, x: 20, duration: 0.2 }, "-=0.1")
      .to(".anim-button", { opacity: 0, scale: 0.8, duration: 0.2 }, "-=0.1")
      .to(".custom-spotlight-card", {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.3,
        stagger: 0.08,
      }, "-=0.1")
      .to(".anim-header", { opacity: 0, y: -20, duration: 0.3 }, "-=0.2");
    }, containerRef);
  };

  return (
    <div ref={containerRef} className="dash">
      <div className="anim-header">
        <h1
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: "30px",
          }}
        >
          Início
        </h1>
        <hr />
      </div>

      <div className="cartooes">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(255, 255, 255, 0.93)"
        >
          <h1
            style={{
              color: "black",
              fontSize: "20px",
            }}
          >
            Cartazes Ativos
          </h1>
          <h2
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            50
          </h2>
        </SpotlightCard>

        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(255, 255, 255, 0.93)"
        >
          <h1
            style={{
              color: "black",
              fontSize: "20px",
            }}
          >
            Em nossa rotação
          </h1>
          <h2
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            10
          </h2>
        </SpotlightCard>

        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(255, 255, 255, 0.93)"
        >
          <div
            style={{ display: "flex", gap: "10px", flexDirection: "column" }}
          >
            <h1
              style={{
                color: "black",
                fontSize: "20px",
              }}
            >
              Próximo Evento
            </h1>
            <hr />
            <h2
              style={{
                color: "black",
              }}
            >
              Campeonato de Pebolim
            </h2>
          </div>
        </SpotlightCard>
      </div>

      <div className="anim-button">
        <Bot texto={"Novo Cartaz"} corFundo="#24262e" />
      </div>

      <h2
        className="titulo"
        style={{
          color: "black",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        Próximos Avisos
      </h2>
      <div
        className="ListaAnimation"
        style={{ display: "flex", gap: "30px", flexDirection: "column" }}
      >
        <hr />
        <ul>
          <li className="firstLi">Prova Amanhã</li>
          <hr />
          <li className="secLi">Intervalo</li>
          <hr />
          <li className="thirdLi">Evento Sexta</li>
        </ul>
      </div>
    </div>
  );
}