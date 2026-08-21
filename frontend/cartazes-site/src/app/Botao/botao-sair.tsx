type Props = {
    texto: string,
    corFundo: string,
    
}

export function BotS({texto, corFundo}: Props){
    return(
        <button
        style={{
            background: "rgb(218, 37, 28)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            width: "130px",
            padding: "10px"
            
        }}
        >
             {texto}
        </button>
    );
}