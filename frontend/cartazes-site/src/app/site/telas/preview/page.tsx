import { CardCartaz } from "@/app/Cartao/card-to-cartazes";
import { Bot } from "@/app/Botao/botao-criar";
import { Bote } from "@/app/Botao/botao-ee";
import { CardProg } from "@/app/Cartao/card-to-prog";
import { Tela } from "@/app/Cartao/card-view";
import Image from 'next/image'
import patoImg from '../../../../../public/assets/images/pato.jpg' 


export default function Cartzes() {
    return (

        <div
         style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }} >
            <Image src={patoImg} alt={""}
                style={{
                   borderRadius: "50px",
                    width: "90%",
                    height: "90%",
                    background: "rgb(255, 236, 202)",
            }}></Image>
           
    </div>
    );
}