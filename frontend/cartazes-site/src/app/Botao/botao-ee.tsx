type Props = {
    texto: string,
    corFundo: string,
    
}

export function Bote({texto, corFundo}: Props){
    return(
        <button
        style={{
            background: corFundo,
            color: "black",
            border: "none",
            borderRadius: "10px",
            width: "80px",
            padding: "10px",
            boxShadow: " 8px 8px 28px 0px rgba(0,0,0,0.28)"

            
        }}
        className="botee"
        >
             {texto}
        </button>
    );
}