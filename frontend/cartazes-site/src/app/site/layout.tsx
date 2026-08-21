'use client'

import { useRouter } from 'next/navigation'
import Image from "next/image";
import ImagemSenai from "@/app/imagens/senai.jpg"
import { Botemais } from '../Botao/botao-mais';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  function handleLogout() {
  const confirmar = window.confirm("Deseja realmente sair?");
  if (confirmar) {
    router.push("/");
  }
}

return (
  <>
    <header className="cabeçalho">
      <Image src={ImagemSenai} alt="" width={190} height={50} />
      <div className="headThings">
        <h2>Nome</h2>
        <Botemais
          corFundo="#e0e0e0"
          opcoes={[
            { label: "Sair", onClick: handleLogout },
            { label: "Modo de Vizualização", onClick: () => console.log("mudou modo") },
          ]}
        />
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
        <button type="button" onClick={() => router.push('/site/telas/preview')} className="side-bar-btn">
          Pré-Visualização
        </button>
      </div>

      {children}
    </>
  );
}