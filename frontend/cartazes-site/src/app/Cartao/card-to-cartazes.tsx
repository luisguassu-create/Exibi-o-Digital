import { Bote } from "../Botao/botao-ee";
import Image from 'next/image'
import patoImg from '../../../public/assets/images/pato.jpg' 

type Props = {
    texto: string,
    numero?: number,
    corFundo: string,
    textoBaixo: string
}

export function CardCartaz({texto, numero, corFundo, textoBaixo}: Props){
    return(
        
     <section
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "20px",
            width: "100%",
            height: "350px",
            background: " rgb(229, 229, 231)",
            gap: "180px",
            // boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.51)"
        }}
    
     >
        
        <Image src={patoImg} alt={""}  style={{
            width: "200px",
            height: "150px",
            borderRadius: "30px",
            padding: "20px"
        }}/>
        <div style={{display: "flex", flexDirection: "column"}}>

        <h1 style={{ color: "black", padding:"10px"}}>{texto}</h1>
        <h2 style={{ color: "black",padding:"10px"}}>{textoBaixo}</h2>
        </div>
        <div style={{display: "flex", gap: 30, justifyContent: "end ", alignItems: "center"}}>
        
        <Bote texto={"Editar"} corFundo={""} />
        <Bote texto={"Excluir"} corFundo={""} />
       
 </div>
      
      
     </section>
   
    );
}