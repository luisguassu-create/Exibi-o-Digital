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
           
            <CardProg texto={"Prova amanha"} corFundo={""} textoBaixo={"de 10 as 25"} horas={"8:00"} para={"Pessoal, lembrando que teremos prova amanhã. É importante revisar o conteúdo estudado e se preparar para a avaliação. Boa sorte a todos!"} />
            <CardProg texto={"Evento Sexta"} corFundo={""} textoBaixo={"de 20 as 4"} horas={"10:00"} para={"Pessoal, passando para avisar que teremos um evento nesta sexta-feira! Contamos com a presença de todos para aproveitar esse momento juntos. Não deixem de participar!"} />
            <CardProg texto={"Intervalo"} corFundo={""} textoBaixo={"de 9 as 9 e 15"} horas={"12:00"} para={"Pessoal, informamos que agora teremos um intervalo. Aproveitem esse momento para descansar, conversar e recarregar as energias antes de retomarmos as atividades!"} />
        </div>
    );
}