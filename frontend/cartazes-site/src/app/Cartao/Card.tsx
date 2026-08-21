type Props = {
    texto: string,
    numero?: number,
    corFundo: string,
    textoBaixo?: string,
    corTexto: string,

}

export function Cards({texto, numero, corFundo, textoBaixo, corTexto}: Props){
    return(
     <section
        style={{
            borderRadius: "10px",
            width: "300px",
            height: "120px",
            background: corFundo,
             boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.41)"
        }}
     >
        <h1 style={{ color: corTexto, padding:"10px"}}>{texto}</h1>
        <h2 style={{fontSize: "40px", color: corTexto,padding:"10px"}}>{numero} {textoBaixo}</h2>
     </section>
    );
}