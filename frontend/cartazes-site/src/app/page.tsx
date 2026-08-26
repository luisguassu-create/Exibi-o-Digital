"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SenaiImg from "../../public/assets/images/senai-logo.png";
import AlunosImg from "../../public/assets/images/senai-alunos.jpg";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type AlertaTipo = "warning" | "danger" | null;

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [alerta, setAlerta] = useState<AlertaTipo>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".login", { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" })
        .from(".textcima", { opacity: 0, scale: 0.8, duration: 0.6 }, "-=0.3")
        .from(".animacaixa", { opacity: 0, x: -20, stagger: 0.15, duration: 0.5 }, "-=0.3");

      const inputs = containerRef.current?.querySelectorAll<HTMLInputElement>("input");

      const handleFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        gsap.to(target.parentElement, { scale: 1.02, duration: 0.2, ease: "power1.out" });
      };

      const handleBlur = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        gsap.to(target.parentElement, { scale: 1, duration: 0.2 });
      };

      inputs?.forEach((input) => {
        input.addEventListener("focus", handleFocus);
        input.addEventListener("blur", handleBlur);
      });

      return () => {
        inputs?.forEach((input) => {
          input.removeEventListener("focus", handleFocus);
          input.removeEventListener("blur", handleBlur);
        });
      };
    },
    { scope: containerRef }
  );

  function shakeError(el: HTMLElement | null) {
    if (!el) return;
    gsap.fromTo(
      el,
      { x: -7 },
      {
        x: 7,
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        clearProps: "x",
        ease: "power1.inOut",
      }
    );
  }

  function entrar() {
    // Campos vazios -> aviso (warning)
    if (!email || !senha) {
      setAlerta("warning");
      shakeError(containerRef.current?.querySelector<HTMLElement>(".login") || null);
      return;
    }

    // Credenciais erradas -> erro (danger)
    if (email === "admin@gmail.com" && senha === "12345") {
      setAlerta(null);
      router.push("../site/telas/dashboard");
    } else {
      setAlerta("danger");
      shakeError(containerRef.current?.querySelector<HTMLElement>(".login") || null);
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
      className="login-wrapper"
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}
    >
      {/* Background */}
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
          zIndex: 0,
          filter: "blur(5px)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Conteúdo por cima do background */}
      <div className="login" style={{ position: "relative", zIndex: 2 }}>
        <div className="textcima">
          <h1 style={{ fontSize: "30px" }}>
            Faça o seu <br />
            <span style={{ fontSize: "35px", color: "red" }}>Login</span>
          </h1>
          <br />
        </div>

        {/* Alerta */}
        {alerta && (
          <div
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
            style={{
              borderRadius: "10px",
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
            style={{
              borderRadius: "10px",
              height: "30px",
            }}
          />
          <label htmlFor="senha">Adicione sua Senha:</label>
        </div>

        <button onClick={entrar}>Entrar</button>

        <a href="/visualizador">Entrar como visualizador</a>
      </div>
    </div>
  );
}