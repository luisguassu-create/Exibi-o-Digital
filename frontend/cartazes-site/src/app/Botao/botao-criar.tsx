"use client";

import { NovoCartazButton } from "@/components/botao";
// import { NovoCartazButton } from "@/components/Botao/botao-ee";
import Modal from "@/components/modal-criar";
import { useState } from "react";

type Props = {
    texto: string;
    corFundo?: string;
};

export function Bot({ texto }: Props) {
    const [aberto, setAberto] = useState(false);

    return (
        <>
            <NovoCartazButton onClick={() => setAberto(true)} className="botc">
                + {texto}
            </NovoCartazButton>

            <Modal isOpen={aberto} onClose={() => setAberto(false)} />
        </>
    );
}