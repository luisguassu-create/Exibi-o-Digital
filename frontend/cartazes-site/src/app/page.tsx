"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SenaiImg from "../../public/assets/images/senai-logo.png";
import AlunosImg from "../../public/assets/images/senai-alunos.jpg";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook oficial do GSAP para React - lida com Strict Mode e limpa animações automaticamente
  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".login", { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" })
        .from(".textcima", { opacity: 0, scale: 0.8, duration: 0.6 }, "-=0.4")
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
    if (email === "admin@gmail.com" && senha === "12345") {
      router.push("../site/telas/dashboard");
    } else {
      shakeError(containerRef.current?.querySelector<HTMLElement>(".login") || null);
      alert("Email ou senha incorretos!");
    }
  }

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
          <h1 style={{ fontSize: "20px" }}>
            Faça o seu <br />
            <span style={{ fontSize: "30px", color: "red" }}>Login</span>
          </h1>
          <br />
        </div>

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