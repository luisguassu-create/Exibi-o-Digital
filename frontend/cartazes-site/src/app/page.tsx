"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    
    <div className="login-wrapper">
      <div className="login">
        <svg
          className="guest-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"

          // style={{border:"1px black solid", borderRadius:"50%"}}
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
        </svg>

          <label htmlFor="email">Adicione seu Email:</label>

        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="senha">Adicione sua Senha:</label>

        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

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