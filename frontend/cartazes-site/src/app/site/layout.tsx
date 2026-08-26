'use client'
import { Montserrat } from 'next/font/google';



            import Avatar from '@mui/material/Avatar';
            import Stack from '@mui/material/Stack';
            import {deepOrange} from '@mui/material/colors';

import { useRouter } from 'next/navigation'
import Image from "next/image";
import ImagemSenai from "@/app/imagens/senai.jpg"
import { Botemais } from '../Botao/botao-mais';
// import Stack from '@mui/material/Stack';
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // Escolha os pesos que deseja usar
  variable: '--font-montserrat', // Opcional: útil para Tailwind CSS
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()


  return (
    < >
    <body className={montserrat.className}>
      
    
      
    
      <header className="cabeçalho">
        <Image src={ImagemSenai} alt="" width={190} height={50} />
        <div className="headThings">

          <div>

  
            <Stack direction="row" spacing={2}>
          
              <Avatar src="/broken-image.jpg" />
            </Stack>
        
          </div>
          <h2>Nome</h2>
          <Botemais
            corFundo="#e0e0e0"
            opcao1={'Sair'} opcao2={'NaoSei'} />
        </div>
      </header>


      <div className="side-bar">
        <button type="button" onClick={() => router.push('/site/telas/dashboard')} className="side-bar-btn">
          Início
        </button>
        <button type="button" onClick={() => router.push('/site/telas/cartazes')} className="side-bar-btn">
          Cartazes
        </button>
        <button type="button" onClick={() => router.push('/site/telas/programacao')} className="side-bar-btn">
          Programação
        </button>
        <button type="button" onClick={() => router.push('/site/telas/carrosel')} className="side-bar-btn">
          Pré-Visualização
        </button>
      </div>

      {children}
      </body>
    </>
  );
}