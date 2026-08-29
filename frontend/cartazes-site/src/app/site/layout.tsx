"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useGSAP } from "@gsap/react";
import ImagemSenai from "@/app/imagens/senai.jpg";
import { Botemais } from "../Botao/botao-mais";
import { useTransition } from "@/components/Transitioncontext";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import IconButton from "@mui/material/IconButton";
import { useState, useRef } from "react";
import Modal from "@/components/modal-mudar";
import gsap from "gsap";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Nome");
  const router = useRouter();
  const { revealHeaderAndSidebar } = useTransition();
  const [avatarUsuario, setAvatarUsuario] = useState<string>("/broken-image.jpg");

  const footerItemsRef = useRef<(HTMLElement | null)[]>([]);
  const hrRef = useRef<HTMLHRElement | null>(null);

  useGSAP(() => {
    revealHeaderAndSidebar();

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Anima o Avatar, Nome e Botão de Ícone com a mesma animação e stagger
    tl.from(footerItemsRef.current.filter(Boolean), {
      opacity: 0,
      y: 15,
      duration: 0.5,
      stagger: 0.1,
    })
    // Anima a opacidade do <hr> com 0.3 segundos após os itens aparecerem
    .fromTo(
      hrRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      "+=0.3"
    );
  }, []);

  return (
    // app-shell é o container do grid: header, side-bar e app-content
    // precisam ser filhos DIRETOS dele para grid-template-areas funcionar
    <div className="app-shell">
      <header className="cabeçalho">
        <Image src={ImagemSenai} alt="Logo SENAI" width={190} height={50} />
        <div className="headThings">
          <section className="seguirb"></section>
          <Stack direction="row" spacing={2}>
            <Avatar src={avatarUsuario} />
          </Stack>
          <h2>{nomeUsuario}</h2>
          <Botemais
            corFundo="#e0e0e0"
            opcao1={"Sair"}
            opcao2={"Vizualização"}
          />
        </div>
      </header>

      <nav className="side-bar">
        {/* Início */}
        <button
          type="button"
          onClick={() => router.push("/site/telas/dashboard")}
          className="side-bar-btn"
          style={{ display: "flex", gap: "20px" }}
        >
          <div className="icon-overlay-container">
            <HomeIcon className="icon-base" />
            <HomeIcon className="icon-fill" aria-hidden="true" />
          </div>
          Início
        </button>

        {/* Cartazes */}
        <button
          type="button"
          onClick={() => router.push("/site/telas/cartazes")}
          className="side-bar-btn"
          style={{ display: "flex", gap: "20px" }}
        >
          <div className="icon-overlay-container">
            <FolderIcon className="icon-base" />
            <FolderIcon className="icon-fill" aria-hidden="true" />
          </div>
          Cartazes
        </button>

        {/* Programação */}
        <button
          type="button"
          onClick={() => router.push("/site/telas/programacao")}
          className="side-bar-btn"
          style={{ display: "flex", gap: "20px" }}
        >
          <div className="icon-overlay-container">
            <SubtitlesIcon className="icon-base" />
            <SubtitlesIcon className="icon-fill" aria-hidden="true" />
          </div>
          Programação
        </button>

        <button
          type="button"
          onClick={() => router.push("/site/telas/carrosel")}
          className="side-bar-btn"
          style={{ display: "flex", gap: "20px" }}
        >
          <div className="icon-overlay-container">
            <EditDocumentIcon className="icon-base" />
            <EditDocumentIcon className="icon-fill" aria-hidden="true" />
          </div>
          Modificar Layout
        </button>

        {/* Rodapé */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignContent: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <hr
              ref={hrRef}
              style={{ width: "150%", color: "hsl(240, 7%, 38%)" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              padding: "20px 28px",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              ref={(el) => {
                footerItemsRef.current[0] = el;
              }}
            >
              <Avatar src={avatarUsuario} />
            </Stack>

            <h1
              ref={(el) => {
                footerItemsRef.current[1] = el;
              }}
              style={{ fontSize: "22px", margin: 0, lineHeight: 1 }}
            >
              {nomeUsuario}
            </h1>

            <IconButton
              ref={(el) => {
                footerItemsRef.current[2] = el;
              }}
              className="botaoEditI"
              onClick={() => setAberto(true)}
              style={{ padding: 4 }}
            >
              <EditSquareIcon style={{ height: "20px", width: "20px" }} />
            </IconButton>

            <Modal
              isOpen={aberto}
              onClose={() => setAberto(false)}
              onSave={(novoNome, novoAvatar) => {
                if (novoNome.trim() !== "") setNomeUsuario(novoNome);
                if (novoAvatar) setAvatarUsuario(novoAvatar);
              }}
            />
          </div>
        </div>
      </nav>

      <main className="app-content">{children}</main>
    </div>
  );
}