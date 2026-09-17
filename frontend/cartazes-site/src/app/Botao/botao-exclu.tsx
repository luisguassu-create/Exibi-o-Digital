type Props = {
    texto: string;
    corFundo: string;
    onClick?: () => void;
};

export function Botexc({ texto, corFundo, onClick }: Props) {
    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={onClick}
                style={{
                    background: corFundo,
                    color: "black",
                    border: "none",
                    borderRadius: "10px",
                    width: "80px",
                    padding: "10px",
                    boxShadow: "8px 8px 28px 0px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                }}
                className="botee"
            >
                {texto}
            </button>
        </div>
    );
}