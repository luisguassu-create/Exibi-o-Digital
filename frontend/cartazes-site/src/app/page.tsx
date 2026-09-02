"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SenaiImg from "../../public/assets/images/senai-logo.png";
import AlunosImg from "../../public/assets/images/senai-alunos.jpg";
import LogoSenai from "../../public/assets/images/SENAI-SP.jpg";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTransition } from "@/components/Transitioncontext";

type AlertaTipo = "warning" | "danger" | null;

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [alerta, setAlerta] = useState<AlertaTipo>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const alertaRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);

  const { navigateWithTransition, revealPlainPage } = useTransition();

   
  useGSAP(
    () => {
      revealPlainPage();

      // Timeline de Entrada com Curva de Easing Fluida
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1 },
      )
        .from(
          ".textcima *",
          { opacity: 0, y: -20, duration: 0.6, stagger: 0.1 },
          "-=0.6",
        )
        .from(
          ".animacaixa",
          { opacity: 0, y: 20, duration: 0.5, stagger: 0.12 },
          "-=0.4",
        )
        .from(
          ".btn-entrar, .link-visualizador",
          { opacity: 0, scale: 0.9, duration: 0.4, stagger: 0.1 },
          "-=0.2",
        );
    },
    { scope: containerRef },
  );

  // Efeito Parallax no Hover do Background
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!bgImgRef.current) return;
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 20;
    const yPos = (clientY / window.innerHeight - 0.5) * 20;

    gsap.to(bgImgRef.current, {
      x: xPos,
      y: yPos,
      duration: 1.2,
      ease: "power2.out",
    });
  };

  // Focus nos Inputs com GSAP
  const handleFocus = (target: HTMLElement) => {
    gsap.to(target, { scale: 1.02, duration: 0.2, ease: "power2.out" });
  };

  const handleBlur = (target: HTMLElement) => {
    gsap.to(target, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  // Feedback de Erro (Shake Interativo)
  function shakeError() {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { x: -12 },
      {
        x: 12,
        duration: 0.07,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set(cardRef.current, { x: 0 }),
      },
    );
  }

  // Animação do Aparecimento do Alerta e Expansão de Altura do Card
  const triggerAlerta = (tipo: AlertaTipo) => {
    setAlerta(tipo);
    shakeError();

    // Transição suave de expansão de altura da caixa de login
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        height: 470,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    requestAnimationFrame(() => {
      if (alertaRef.current) {
        gsap.fromTo(
          alertaRef.current,
          { opacity: 0, y: -10, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" },
        );
      }
    });
  };

  function entrar() {
    if (!email || !senha) {
      triggerAlerta("warning");
      return;
    }

    if (email === "admin@gmail.com" && senha === "12345") {
      setAlerta(null);
      // Animação de Saída de Sucesso antes da Transição de Tela
      gsap.to(cardRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => navigateWithTransition("../site/telas/dashboard"),
      });
    } else {
      triggerAlerta("danger");
    }
  }

  const alertaConfig = {
    warning: {
      titulo: "Atenção",
      mensagem: "Preencha o email e a senha para continuar.",
      cor: "#b45309",
      fundo: "#fffbeb",
    },
    danger: {
      titulo: "Erro",
      mensagem: "Email ou senha incorretos.",
      cor: "#dc2626",
      fundo: "#fef2f2",
    },
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="login-wrapper"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={bgImgRef}
        style={{
          position: "absolute",
          inset: "-20px",
          zIndex: 0,
        }}
      >
        <Image
          src={AlunosImg}
          alt="Background Description"
          placeholder="blur"
          quality={80}
          fill
          sizes="100vw"
          priority
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: "blur(5px)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div
        ref={cardRef}
        className="login"
        style={{
          position: "relative",
          zIndex: 2,
          height: "400px", // Mapeia para a altura inicial fluida sem pulo
          maxHeight: "1000px",
        }}
      >
        <div
          className="textcima"
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            flexDirection: "column",
          }}
        >
          <Image
            src={LogoSenai}
            alt=""
            style={{ width: "4.5vw", height: "2vh", objectFit: "contain" }}
          />
          <h1 style={{ fontSize: "30px" }}>
            Faça o seu <br />
            <span style={{ fontSize: "35px", color: "red" }}>Login</span>
          </h1>
          <br />
        </div>

        {/* Alerta Animado */}
        {alerta && (
          <div
            ref={alertaRef}
            role="alert"
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              color: alertaConfig[alerta].cor,
              background: alertaConfig[alerta].fundo,
              borderRadius: "10px",
              fontWeight: 400,
              marginBottom: "12px",
            }}
          >
            <span style={{ fontWeight: 600, marginRight: "8px" }}>
              {alertaConfig[alerta].titulo}
            </span>
            {alertaConfig[alerta].mensagem}
          </div>
        )}

        <div className="animacaixa">
          <input
            placeholder=" "
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => handleFocus(e.target.parentElement!)}
            onBlur={(e) => handleBlur(e.target.parentElement!)}
            style={{
              borderRadius: "10px",
              // border: "1px rgb(154, 154, 154) solid",
              height: "30px",
            }}
          />
          <label htmlFor="email">Adicione seu Email:</label>
        </div>

        <div className="animacaixa">
          <input
            placeholder=" "
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onFocus={(e) => handleFocus(e.target.parentElement!)}
            onBlur={(e) => handleBlur(e.target.parentElement!)}
            style={{
              borderRadius: "10px",
              height: "30px",
            }}
          />
          <label htmlFor="senha">Adicione sua Senha:</label>
        </div>

        <button className="btn-entrar" onClick={entrar}>
          Entrar
        </button>

        <a  onClick={() => router.push("/site/telas/carroselVisual")} className="link-visualizador">
          Entrar como visualizador
        </a>
      </div>
    </div>
  );
}