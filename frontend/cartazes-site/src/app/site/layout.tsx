'use client'

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useGSAP } from "@gsap/react";
import ImagemSenai from "@/app/imagens/senai.jpg";
import { Botemais } from '../Botao/botao-mais';
import { useTransition } from "@/components/Transitioncontext";

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
                <button
                    type="button"
                    onClick={() => router.push('/site/telas/dashboard')}
                    className="side-bar-btn"
                >
                    Início
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/site/telas/cartazes')}
                    className="side-bar-btn"
                >
                    Cartazes
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/site/telas/programacao')}
                    className="side-bar-btn"
                >
                    Programação
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/site/telas/carrosel')}
                    className="side-bar-btn"
                >
                    Modificar Layout
                </button>
            </nav>

            <main className="app-content">
                {children}
            </main>
        </div>
    );
}