"use client";
import Modal from "@/components/modal-editar";
import { useState } from "react";

type Props = {
    texto: string,
    corFundo: string,
}

export function Bote({ texto, corFundo }: Props) {
    const [aberto, setAberto] = useState(false);
    return (
           <>
       
            <button
                onClick={() => setAberto(true)}
                style={{
                    background: corFundo,
                    color: "black",
                    border: "none",
                    borderRadius: "10px",
                    width: "80px",
                    padding: "10px",
                    boxShadow: " 8px 8px 28px 0px rgba(0,0,0,0.1)"
                }}
                className="botee"
            >
                {texto}
            </button>

           <Modal isOpen={aberto} onClose={() => setAberto(false)} />
             
                   
                </>
          
        
    );
}