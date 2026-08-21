import { CardCartaz } from "@/app/Cartao/card-to-cartazes";
import { Bot } from "@/app/Botao/botao-criar";
import { Bote } from "@/app/Botao/botao-ee";

export default function Cartzes() {
    return (

        <div className="windowc"
        style={{
            display: "flex",
            flexDirection: "column",
             gap: "50px"
            }}>
            <div className="paralelo">
            <h1>Cartazes</h1>
            <Bot texto={"Novo Cartaz"} corFundo={"#0f1899"} />
            </div>
            <hr />
    
              
            <CardCartaz texto={"Prova amanha"} corFundo={""} textoBaixo={"de 10 as 25"} />
            <CardCartaz texto={"Evento Sexta"} corFundo={""} textoBaixo={"de 20 as 4"} />
            <CardCartaz texto={"Intervalo"} corFundo={""} textoBaixo={"de 9 as 9 e 15"} />
       
               
        </div>
    );
}