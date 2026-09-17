import Image from "next/image";

import patoImg from "../../../public/assets/images/pato.jpg";

import { Bote } from "../Botao/botao-ee";
import { Botexc } from "../Botao/botao-exclu";

type Props = {
    id: number;
    texto: string;
    imagem?: string;
    numero?: number;
    corFundo: string;
    textoBaixo: string;
    textoLado: string;
    onExcluir?: (id: number) => Promise<void>;
};

export function CardCartaz({
    id,
    texto,
    imagem,
    corFundo,
    textoBaixo,
    textoLado,
    onExcluir,
}: Props) {
   const imagemCartaz =
    imagem
        ? imagem.startsWith("http")
            ? imagem
            : `http://localhost:3001/uploads/${imagem}`
        : patoImg;

    return (
        <section
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                width: "100%",
                height: "350px",
                background: "rgb(255, 255, 255)",
                gap: "80px",
                boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.1)",
            }}
        >
            <div style={{ display: "flex", gap: "220px" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <Image
                        src={imagemCartaz}
                        alt=""
                        width={200}
                        height={150}
                        style={{
                            width: "200px",
                            height: "150px",
                            borderRadius: "30px",
                            padding: "20px",
                            objectFit: "cover",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                        }}
                    >
                        <h1
                            style={{
                                color: "black",
                                margin: 0,
                                padding: "5px 5px 0 5px",
                                fontSize: "30px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {texto}
                        </h1>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, max-content)",
                                columnGap: "30px",
                                rowGap: "5px",
                                justifyItems: "start",
                                textAlign: "start",
                                padding: "0 5px",
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: "14px",
                                    margin: 0,
                                }}
                            >
                                Dias Visiveis
                            </h2>

                            <h2
                                style={{
                                    fontSize: "14px",
                                    margin: 0,
                                }}
                            >
                                Horario Visiveis
                            </h2>

                            <h2
                                style={{
                                    color: "black",
                                    margin: 0,
                                }}
                            >
                                {textoBaixo}
                            </h2>

                            <h2
                                style={{
                                    color: "black",
                                    margin: 0,
                                }}
                            >
                                {textoLado}
                            </h2>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Bote texto={"Editar"} corFundo={""} />

                    <Botexc
    texto={"Excluir"}
    corFundo={""}
/>
                </div>
            </div>
        </section>
    );
}