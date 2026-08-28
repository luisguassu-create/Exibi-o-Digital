import { Bote } from "../Botao/botao-ee";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; //evento
import Icon from "@mui/material/Icon";

type Props = {
  texto: string;
  numero?: number;
  corFundo: string;
  textoBaixo: string;
  horaInicio: string;
  horaFim: string;
  sala: string;
  docente: string;
  atividade: string;
  papel?: string
  calendario?: string;
  iconeAtividade?: string;

};






export function CardProg({
  texto,
  numero,
  corFundo,
  textoBaixo,
  horaInicio,
  horaFim,
  sala,
  docente,
  atividade,
  papel,
  calendario,
  iconeAtividade

}: Props) {
  return (
    <section className="everyincard">
      <section
        className="secCardCartaz"
        style={{
          display: "flex",
          flexDirection: "row", // Alterado para row para permitir alinhar a IconeTexto à direita
          justifyContent: "space-between", // Separa o conteúdo da esquerda do ícone da direita
          alignItems: "center", // Centraliza tudo verticalmente
          borderRadius: "10px",
          width: "100%",
          height: "180px",
          padding: "0 20px", // Adicionado espaçamento interno nas laterais
          background: "hsl(0, 0%, 100%)",
          boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.31)",
        }}
      >
        {/* Bloco de Informações da Esquerda */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div>
            <h1 style={{ color: "hsl(240, 4%, 5%)", fontSize: "16px" }}>
              {horaInicio} - {horaFim}
            </h1>
            <h1 style={{ color: "black", fontSize: "30px" }}>
              {texto}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <LocationOnIcon />
            <h2 style={{ fontSize: "18px" }}>{sala}</h2>
          </div>

          <h2 style={{ fontSize: "18px" }}>Docente: {docente}</h2>
        </div>

        <div
          className="IconeTexto"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
        
          {papel && (
            <DescriptionIcon
              style={{ display: "block", fontSize: "20px" }}
            />
          )}

       
          {calendario && (
            <CalendarTodayIcon
              style={{ display: "block", fontSize: "20px" }}
            />
          )}

          <h2 style={{ fontSize: "20px", margin: 0, lineHeight: 1 }}>
            {atividade}
          </h2>
        </div>
      </section>
    </section>
  );
}