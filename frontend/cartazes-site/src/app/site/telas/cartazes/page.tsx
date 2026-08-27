import { CardCartaz } from "@/app/Cartao/card-to-cartazes";
import { Bot } from "@/app/Botao/botao-criar";
import { Bote } from "@/app/Botao/botao-ee";

export default function Cartzes() {
  return (
    <div
      className="windowc"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
      }}
    >
      <div className="paralelo" style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
        <h1
          style={{
            color: " black",
            fontWeight: "bold",
            fontSize: "30px",
          }}
        >
          Cartazes
        </h1>
        <Bot texto={"Novo Cartaz"} corFundo={"#d10000"} />
      </div>
      <hr />

      <CardCartaz
        texto={"Prova amanha"}
        corFundo={""}
        textoBaixo={"Dia 10 ate o 25"} textoLado={"7:30 ate 11:30"}      />
      <CardCartaz
        texto={"Evento Sexta"}
        corFundo={""}
        textoBaixo={"Dia 15 ate o 35"} textoLado={"13:00 ate 15:00"}      />
    </div>
  );
}
