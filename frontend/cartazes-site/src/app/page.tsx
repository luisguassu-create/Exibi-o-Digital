"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SenaiImg from "../../public/assets/images/senai-logo.png"
import AlunosImg from "../../public/assets/images/senai-alunos.jpg"


export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const router = useRouter();

  function entrar() {
    if (email === "admin@gmail.com" && senha === "12345") {
      router.push("../site/telas/dashboard");
    } else {
      alert("Email ou senha incorretos!");
    }
  }

  return (
    <div
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
      <div
        className="login"
        style={{ position: "relative", zIndex: 2 }}
      >
      <div className="textcima">
    <h1 style={{ fontSize: "20px" }}>
        Faça o seu{" "} <br />
        <span style={{ fontSize: "30px", color: "red" }}>Login</span>
    </h1>
    <br />
</div>
        {/* <Image src={SenaiImg} alt={""} width={105} height={30} /> */}
   {/* <h2 style={{ */}
    {/* // fontSize:"7px", */}
  {/* //  }}> */}
    {/* O conhecimento é a única coisa que ninguém pode te tomar.</h2> */}
        <div className="animacaixa">

  
        <input
        placeholder=" "
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            // borderBottom: "1px solid black",
            //  border: "1px solid black",
            borderRadius: "10px",
            height: "30px"
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
            height: "30px"
          }}
        />
           <label htmlFor="senha">Adicione sua Senha:</label>
</div>
        <button onClick={entrar}>
          Entrar
        </button>

        <a href="/visualizador">
          Entrar como visualizador
        </a>
      </div>
    </div>
  );
}