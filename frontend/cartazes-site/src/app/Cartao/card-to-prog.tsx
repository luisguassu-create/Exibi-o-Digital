import { Bote } from "../Botao/botao-ee";


type Props = {
    texto: string,
    numero?: number,
    corFundo: string,
    textoBaixo: string,
    horas: string ,
    para: string 
    }

export function CardProg({texto, numero, corFundo, textoBaixo, horas,para}: Props){
    return(
        <section className="everyincard">
     <section
      className="secCardCartaz"
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            borderRadius: "10px",
            width: "100%",
            background: "rgb(244, 244, 244)",
            gap: "20px",
            boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.31)"
        }}
     >
        <div style={{display: "flex", alignItems: "start",justifyContent: "flex-start"}}>
          <img src="../imagens/" alt="" />
          <div style={{display: "flex", flexDirection: "row", gap:"20px", justifyContent: "flex-start"}}
          className="testeblur">
            <h1 style={{ color: "rgb(51, 52, 60)", padding:"10px" }}>{horas}</h1>
            <h1 style={{ color: "black", padding:"10px"}}>{texto}</h1>
          </div>
        </div>
        {/* <hr style={{ color: "black", width:"100%"}}/> */}

        <p className="paragra">
         {para}
        </p>
      </section>
     </section>
    );
}