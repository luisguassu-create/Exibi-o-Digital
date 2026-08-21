type Props = {
    texto: string,
    corFundo: string,
    
}

export function Bot({texto, corFundo}: Props){
    return(
        <button
        style={{
            background: corFundo,
            color: "white",
            border: "none",
            borderRadius: "10px",
            width: "130px",
            padding: "10px"
            
        }}
        className="botc"
        >
            + {texto}
        </button>
    );
}