import SpotlightCard from "@/components/SpotlightCard";
import { Bot } from "../../../Botao/botao-criar";
import { Cards } from "../../../Cartao/Card";

export default function Home() {
  return (
    <div className="dash"  >
      <h1
        style={{
          color: " black",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        Início
      </h1>
      <hr />
      <div className="cartooes">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(255, 255, 255, 0.93)"
        >
          <h1
            style={{
              color: "black",
              fontSize: "20px",
            }}
          >
            Cartazes Ativos
          </h1>
          <h2
            style={{
              color: " red",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            50
          </h2>
        </SpotlightCard>
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(255, 255, 255, 0.93)"
        >
          <h1
            style={{
              color: "black",
              fontSize: "20px",
            }}
          >
            Em nossa rotação
          </h1>
          <h2
            style={{
              color: " red",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            10
          </h2>
        </SpotlightCard>
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(255, 255, 255, 0.93)"
        >
          <div
            style={{ display: "flex", gap: "10px", flexDirection: "column" }}
          >
            <h1
              style={{
                color: "black",
                fontSize: "20px",
              }}
            >
              Proximo Evento
            </h1>
            <hr />
            <h2
              style={{
                color: " black",
              }}
            >
              Campeonato de Pebolim
            </h2>
          </div>
        </SpotlightCard>

        {/* <Cards texto={"Cartazes Ativos"} numero={12} corFundo={"rgba(51, 52, 60, 0.55)"} corTexto={"white"} />
        <Cards texto={"Hoje"} numero={8} corFundo={"rgba(51, 52, 60, 0.27)"} textoBaixo={"em exibição"} corTexto={"white"} />
        <Cards texto={"Hoje"} numero={8} corFundo={"rgba(51, 52, 60, 0.08)"} textoBaixo={"em exibição"} corTexto={"black"} /> */}
      </div>

      <Bot texto={"Novo Cartaz"} corFundo="#24262e" />

      <h2
        className="titulo"
        style={{
          color: " black",
          fontWeight: "bold",
          fontSize: "30px",
        }}
      >
        Proximos Avisos
      </h2>
      <div
        className="ListaAnimation"
        style={{ display: "flex", gap: "30px", flexDirection: "column" }}
      >
        <hr />
        <ul>
          <li className="firstLi">Prova Amanhã</li>
          <hr />
          <li className="secLi">Intervalo</li>
          <hr />
          <li className="thirdLi">Evento Sexta</li>
        </ul>
      </div>
    </div>
  );
}