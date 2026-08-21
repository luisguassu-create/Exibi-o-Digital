import { Bot } from "../../../Botao/botao-criar";
import { Cards } from "../../../Cartao/Card";

export default function Home() {
  return (

    
    <div className="dash" >
      <h1>Dashboard</h1>
      <hr />
      <div className="cartooes">
        <Cards texto={"Cartazes Ativos"} numero={12} corFundo={"rgb(51, 52, 60)"} corTexto={"white"} />
        <Cards texto={"Hoje"} numero={8} corFundo={"rgb(99, 102, 130)"} textoBaixo={"em exibição"} corTexto={"white"} />
        <Cards texto={"Hoje"} numero={8} corFundo={"rgb(234, 235, 240)"} textoBaixo={"em exibição"} corTexto={"black"} />
      </div>
      <Bot texto={"Novo Cartaz"} corFundo={"red"} />

      <h2>Proximos Avisos</h2>
      <hr />
      <ul>
        <li>Prova Amanhã</li>
        <hr />
        <li>Intervalo</li>
        <hr />
        <li>Evento Sexta</li>
      </ul>
    </div>
  );
}
