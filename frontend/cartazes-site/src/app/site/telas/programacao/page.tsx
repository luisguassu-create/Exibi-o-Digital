import { CardCartaz } from "@/app/Cartao/card-to-cartazes";
import { Bot } from "@/app/Botao/botao-criar";
import { Bote } from "@/app/Botao/botao-ee";
import { CardProg } from "@/app/Cartao/card-to-prog";

export default function Cartzes() {
    return (

        <div className="windowc"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "50px"
            }}>
            <div className="paralelo">
                <h1
                    style={{
                        color: " black",
                        fontWeight: "bold",
                        fontSize: "30px",
                    }}
                >Programação</h1>

            </div>
            <hr />

            <CardProg texto={"Prova amanha"} corFundo={""} papel={"visible"} textoBaixo={""} horaInicio={"8:00"} horaFim={"9:30"} sala={"Sala 102"} docente={"Alexandre e Bruno"} atividade={"Prova"} />
            <CardProg texto={"Evento"} corFundo={""} calendario={"visible"} textoBaixo={""} horaInicio={"14:00"} horaFim={"15:00"} sala={"Refeitorio"} docente={"Sandro"} atividade={"Envento"} />

        </div>
    );
}