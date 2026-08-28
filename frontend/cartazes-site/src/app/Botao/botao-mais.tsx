"use client";

import Modal from "@/components/modal-mais-opcoes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {
    corFundo: string;
    opcao1: string;
    opcao2: string;
}

export function Botemais({ corFundo, opcao1, opcao2 }: Props) {
    const [aberto, setAberto] = useState(false);
    const router = useRouter();

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={() => setAberto(!aberto)}
                style={{
                    position: "absolute",
                    bottom: "-17px",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    width: "45px",
                    height: "30px",
                    minWidth: "32px",
                    flexShrink: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    // boxShadow: "4px 4px 12px 0px rgba(0,0,0,0.28)",
                }}
                className="boteemais"
            >
                {aberto ? "×" : <ExpandMoreIcon />}
            </button>
            
            <Modal 
                isOpen={aberto} 
                onClose={() => setAberto(false)} 
                opcao1={opcao1}
                opcao2={opcao2}
            />
        </div>
    );
}

