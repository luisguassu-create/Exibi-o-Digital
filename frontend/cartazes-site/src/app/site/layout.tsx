'use client'

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useGSAP } from "@gsap/react";
import ImagemSenai from "@/app/imagens/senai.jpg";
import { Botemais } from '../Botao/botao-mais';
import { useTransition } from "@/components/Transitioncontext";
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import EditDocumentIcon from '@mui/icons-material/EditDocument';


export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { revealHeaderAndSidebar } = useTransition();

    useGSAP(() => {
        revealHeaderAndSidebar();
    }, []);

    return (
        // app-shell é o container do grid: header, side-bar e app-content
        // precisam ser filhos DIRETOS dele para grid-template-areas funcionar
        <div className="app-shell">
            <header className="cabeçalho">
                <Image src={ImagemSenai} alt="Logo SENAI" width={190} height={50} />
                <div className="headThings">
                    <section className='seguirb'></section>
                    <Stack direction="row" spacing={2}>
                        <Avatar src="/broken-image.jpg" />
                    </Stack>
                    <h2>Nome</h2>
                    <Botemais
                        corFundo="#e0e0e0"
                        opcao1={'Sair'}
                        opcao2={'Vizualização'}
                    />
                </div>
            </header>

            <nav className="side-bar">
                {/* Início */}
                <button
                    type="button"
                    onClick={() => router.push('/site/telas/dashboard')}
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
                    onClick={() => router.push('/site/telas/cartazes')}
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
                    onClick={() => router.push('/site/telas/programacao')}
                    className="side-bar-btn"
                    style={{ display: "flex", gap: "20px" }}
                >
                    <div className="icon-overlay-container">
                        <SubtitlesIcon className="icon-base" />
                        <SubtitlesIcon className="icon-fill" aria-hidden="true" />
                    </div>
                    Programação
                </button>

                {/* Modificar Layout */}
                <button
                    type="button"
                    onClick={() => router.push('/site/telas/carrosel')}
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
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-end", height: "100%" }}>
                    <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: 'center' }}>
                        <hr style={{ width: "150%", color: "hsl(240, 7%, 38%)" }} />
                    </div>

                    <div style={{
                        display: "flex",
                        textAlign: "center",
                        gap: "20px",
                        alignItems: "stretch",
                        padding: "28px",
                    }}>
                        <Stack direction="row" spacing={2}>
                            <Avatar src="/broken-image.jpg" />
                        </Stack>
                        <h1 style={{ fontSize: "25px" }}>Nome</h1>
                    </div>
                </div>
            </nav>

            <main className="app-content">
                {children}
            </main>
        </div>
    );
}